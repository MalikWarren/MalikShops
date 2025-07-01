import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import {calcPrices} from '../utils/calcPrices.js';
import {verifyPayPalPayment, checkIfNewTransaction} from '../utils/paypal.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  console.log('addOrderItems called');
  console.log('Order POST body:', req.body);
  const {orderItems, shippingAddress, paymentMethod} = req.body;

  if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    // NOTE: here we must assume that the prices from our client are incorrect.
    // We must only trust the price of the item as it exists in
    // our DB. This prevents a user paying whatever they want by hacking our client
    // side code - https://gist.github.com/bushblade/725780e6043eaf59415fbaf6ca7376ff

    // get the ordered items from our database
    const itemsFromDB = await Product.find({
      _id: {$in: orderItems.map((x) => x._id || x.product)},
    });
    console.log('itemsFromDB:', itemsFromDB);

    // Check stock availability and reduce quantities
    for (const itemFromClient of orderItems) {
      console.log('Processing item:', itemFromClient);

      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) =>
          itemFromDB._id.toString() === itemFromClient._id ||
          itemFromDB._id.toString() === itemFromClient.product
      );

      if (!matchingItemFromDB) {
        res.status(404);
        throw new Error(
          `Product not found: ${itemFromClient._id || itemFromClient.product}`
        );
      }

      console.log(`Stock check for ${matchingItemFromDB.name}:`);
      console.log(`- Current stock: ${matchingItemFromDB.countInStock}`);
      console.log(`- Requested qty: ${itemFromClient.qty}`);

      // Check if enough stock is available
      if (matchingItemFromDB.countInStock < itemFromClient.qty) {
        res.status(400);
        throw new Error(
          `Insufficient stock for ${matchingItemFromDB.name}. Available: ${matchingItemFromDB.countInStock}, Requested: ${itemFromClient.qty}`
        );
      }

      // Reduce stock quantity
      const oldStock = matchingItemFromDB.countInStock;
      matchingItemFromDB.countInStock -= itemFromClient.qty;
      console.log(
        `- Stock reduced from ${oldStock} to ${matchingItemFromDB.countInStock}`
      );

      const savedProduct = await matchingItemFromDB.save();
      console.log(
        `- Product saved with new stock: ${savedProduct.countInStock}`
      );
    }

    // map over the order items and use the price from our items from database
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) =>
          itemFromDB._id.toString() === itemFromClient._id ||
          itemFromDB._id.toString() === itemFromClient.product
      );

      return {
        ...itemFromClient,
        product: itemFromClient._id || itemFromClient.product,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    // calculate prices
    const {itemsPrice, taxPrice, shippingPrice, totalPrice} =
      calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    console.log('Order created successfully:', createdOrder._id);

    // Verify stock was actually updated
    console.log('Verifying stock updates...');
    for (const itemFromClient of orderItems) {
      const updatedProduct = await Product.findById(
        itemFromClient._id || itemFromClient.product
      );
      console.log(
        `Verified stock for ${updatedProduct.name}: ${updatedProduct.countInStock}`
      );
    }

    res.status(201).json(createdOrder);
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({user: req.user._id});
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  console.log('updateOrderToPaid called', req.body);

  // Temporarily disable PayPal verification for testing
  // const {verified, value} = await verifyPayPalPayment(req.body.id);
  // console.log('PayPal verified:', verified, 'value:', value);
  // if (!verified) throw new Error('Payment not verified');

  // const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
  // console.log('Is new transaction:', isNewTransaction);
  // if (!isNewTransaction) throw new Error('Transaction has been used before');

  const order = await Order.findById(req.params.id);
  console.log('Order found:', !!order);

  if (order) {
    // Temporarily skip amount verification
    // const paidCorrectAmount = order.totalPrice.toString() === value;
    // console.log('Paid correct amount:', paidCorrectAmount);
    // if (!paidCorrectAmount) throw new Error('Incorrect amount paid');

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
