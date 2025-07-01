import asyncHandler from '../middleware/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const {email, password} = req.body;

  const user = await User.findOne({email});

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const {name, email, password} = req.body;

  const userExists = await User.findOne({email});

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({message: 'Logged out successfully'});
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Can not delete admin user');
    }
    await User.deleteOne({_id: user._id});
    res.json({message: 'User removed'});
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        $or: [
          {
            name: {
              $regex: req.query.keyword,
              $options: 'i',
            },
          },
          {
            team: {
              $regex: req.query.keyword,
              $options: 'i',
            },
          },
          {
            player: {
              $regex: req.query.keyword,
              $options: 'i',
            },
          },
        ],
      }
    : {};

  const count = await Product.countDocuments({...keyword});
  const products = await Product.find({...keyword})
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  console.log(
    `Products API - Page: ${page}, PageSize: ${pageSize}, Total: ${count}, Pages: ${Math.ceil(
      count / pageSize
    )}, Products returned: ${products.length}`
  );

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
  });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await Product.deleteOne({_id: product._id});
      res.json({message: 'Product removed'});
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500);
    throw new Error(error.message || 'Server error');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
    team,
    player,
    isFeatured,
  } = req.body;

  // Validate required fields - check for empty strings too
  if (
    !name ||
    !name.trim() ||
    !team ||
    !team.trim() ||
    !player ||
    !player.trim()
  ) {
    res.status(400);
    throw new Error('Name, team, and player are required fields');
  }

  const product = new Product({
    name: name.trim(),
    price: price || 0,
    user: req.user._id,
    image: image || '/images/sample.jpg',
    brand: brand || 'Sample brand',
    category: category || 'Sample category',
    countInStock: countInStock || 0,
    numReviews: 0,
    description: description || 'Sample description',
    team: team.trim(),
    player: player.trim(),
    isFeatured: isFeatured || false,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
    team,
    player,
    isFeatured,
  } = req.body;

  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name || product.name;
    product.price = price !== undefined ? price : product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock =
      countInStock !== undefined ? countInStock : product.countInStock;
    product.team = team || product.team;
    product.player = player || product.player;
    product.isFeatured =
      isFeatured !== undefined ? isFeatured : product.isFeatured;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const {rating, comment} = req.body;
  if (rating === undefined || comment === undefined) {
    res.status(400);
    throw new Error('Rating and comment are required');
  }
  const product = await Product.findById(req.params.id);
  if (product) {
    if (!Array.isArray(product.reviews)) product.reviews = [];
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    await product.save();
    res.status(201).json({message: 'Review added'});
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({rating: -1}).limit(3);
  res.json(products);
});

// @desc    Get top selling jerseys based on actual sales data
// @route   GET /api/products/top-selling
// @access  Public
const getTopSellingJerseys = asyncHandler(async (req, res) => {
  // Aggregate sales data from orders
  const topSelling = await Order.aggregate([
    // Unwind orderItems to get individual items
    {$unwind: '$orderItems'},

    // Only include paid orders
    {$match: {isPaid: true}},

    // Group by product and sum quantities sold
    {
      $group: {
        _id: '$orderItems.product',
        totalSold: {$sum: '$orderItems.qty'},
        totalRevenue: {
          $sum: {$multiply: ['$orderItems.price', '$orderItems.qty']},
        },
        orderCount: {$sum: 1},
      },
    },

    // Sort by total sold (descending)
    {$sort: {totalSold: -1}},

    // Limit to top 10
    {$limit: 10},
  ]);

  // If no sales data exists, fall back to featured jerseys
  if (topSelling.length === 0) {
    const featuredJerseys = await Product.find({isFeatured: true})
      .sort({rating: -1, numReviews: -1})
      .limit(10);
    return res.json(featuredJerseys);
  }

  // Get the actual product details for the top-selling products
  const productIds = topSelling.map((item) => item._id);
  const products = await Product.find({_id: {$in: productIds}});

  // Add sales data to products and sort by sales
  const productsWithSales = products.map((product) => {
    const salesData = topSelling.find(
      (sale) => sale._id.toString() === product._id.toString()
    );
    return {
      ...product.toObject(),
      totalSold: salesData ? salesData.totalSold : 0,
      totalRevenue: salesData ? salesData.totalRevenue : 0,
      orderCount: salesData ? salesData.orderCount : 0,
    };
  });

  // Sort by total sold (descending)
  productsWithSales.sort((a, b) => b.totalSold - a.totalSold);

  res.json(productsWithSales);
});

// @desc    Get jerseys by team
// @route   GET /api/products/team/:teamName
// @access  Public
const getJerseysByTeam = asyncHandler(async (req, res) => {
  const teamName = req.params.teamName.replace(/-/g, ' ');
  const jerseys = await Product.find({
    team: {$regex: new RegExp(`^${teamName}$`, 'i')},
  });

  if (jerseys.length === 0) {
    res.status(404);
    throw new Error('No jerseys found for this team');
  }

  res.json(jerseys);
});

// @desc    Get all teams
// @route   GET /api/products/teams
// @access  Public
const getAllTeams = asyncHandler(async (req, res) => {
  const teams = await Product.distinct('team');
  res.json(teams);
});

// @desc    Get featured jerseys based on sales data and popularity
// @route   GET /api/products/featured
// @access  Public
const getFeaturedJerseys = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;

  // Try to get jerseys with actual sales data first
  const topSelling = await Order.aggregate([
    {$unwind: '$orderItems'},
    {$match: {isPaid: true}},
    {
      $group: {
        _id: '$orderItems.product',
        totalSold: {$sum: '$orderItems.qty'},
        totalRevenue: {
          $sum: {$multiply: ['$orderItems.price', '$orderItems.qty']},
        },
      },
    },
    {$sort: {totalSold: -1}},
    {$limit: limit},
  ]);

  let featuredJerseys;

  if (topSelling.length > 0) {
    // Get products with sales data
    const productIds = topSelling.map((item) => item._id);
    const products = await Product.find({_id: {$in: productIds}});

    // Add sales data and sort
    featuredJerseys = products.map((product) => {
      const salesData = topSelling.find(
        (sale) => sale._id.toString() === product._id.toString()
      );
      return {
        ...product.toObject(),
        totalSold: salesData ? salesData.totalSold : 0,
        totalRevenue: salesData ? salesData.totalRevenue : 0,
      };
    });

    featuredJerseys.sort((a, b) => b.totalSold - a.totalSold);
  } else {
    // Fallback to high-rated jerseys with good reviews
    featuredJerseys = await Product.find({})
      .sort({rating: -1, numReviews: -1})
      .limit(limit);
  }

  res.json(featuredJerseys);
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  getTopSellingJerseys,
  getJerseysByTeam,
  getAllTeams,
  getFeaturedJerseys,
};
