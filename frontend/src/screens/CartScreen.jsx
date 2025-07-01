import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {FaTrash} from 'react-icons/fa';
import Message from '../components/Message';
import {addToCart, removeFromCart, setPromoCode} from '../slices/cartSlice';

const PageBg = styled.div`
  background: #f4f5f7;
  min-height: 100vh;
  padding: 2.5rem 0;
`;

const CartContainer = styled.div`
  background: #fff;
  border-radius: 1.5rem;
  box-shadow:
    0 6px 32px 0 rgba(30, 41, 59, 0.1),
    0 1.5px 6px 0 rgba(30, 41, 59, 0.06);
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  @media (max-width: 900px) {
    flex-direction: column;
    max-width: 98vw;
  }
`;

const CartLeft = styled.div`
  flex: 2.2;
  padding: 3.5rem 3rem 3.5rem 3.5rem;
  @media (max-width: 900px) {
    padding: 2rem 1.2rem 1.2rem 1.2rem;
  }
`;

const CartRight = styled.div`
  flex: 1.1;
  background: #fafbfc;
  border-left: 1.5px solid #ececec;
  padding: 3.5rem 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  @media (max-width: 900px) {
    border-left: none;
    border-top: 1.5px solid #ececec;
    padding: 2rem 1.2rem;
  }
`;

const CartTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.2rem;
`;

const CartTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #222;
`;

const CartCount = styled.div`
  font-size: 1.15rem;
  color: #222;
  font-weight: 600;
`;

const CartTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 1.2rem;
`;

const CartTh = styled.th`
  text-align: left;
  color: #888;
  font-size: 0.98rem;
  font-weight: 600;
  padding-bottom: 0.7rem;
`;

const CartTd = styled.td`
  vertical-align: middle;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px #0001;
  padding: 1.6rem 1.2rem;
  font-size: 1.18rem;
  color: #222;
  font-weight: 500;
  &:nth-child(3),
  &:nth-child(4) {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
`;

const ProductImg = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
  border-radius: 0.7rem;
  background: #f4f5f7;
`;

const ProductName = styled(Link)`
  color: #222;
  font-weight: 600;
  font-size: 1.08rem;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const ProductSub = styled.div`
  color: #ff6b35;
  font-size: 0.95rem;
  margin-top: 0.2rem;
`;

const RemoveLink = styled.button`
  background: none;
  border: none;
  color: #b0b3b8;
  font-size: 0.95rem;
  margin-top: 0.2rem;
  cursor: pointer;
  text-decoration: underline;
  &:hover {
    color: #ff6b35;
  }
`;

const QtyControl = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const QtyBtn = styled.button`
  background: #f4f5f7;
  border: none;
  border-radius: 0.7rem;
  width: 48px;
  height: 48px;
  font-size: 1.7rem;
  color: #222;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
  padding: 0 0.7rem;
  &:hover {
    background: #ececec;
  }
`;

const QtyNum = styled.div`
  min-width: 48px;
  text-align: center;
  font-size: 1.35rem;
  font-weight: 700;
  color: #222;
  background: #fff;
  border-radius: 0.7rem;
  border: 2px solid #ececec;
  height: 48px;
  line-height: 48px;
`;

const ContinueLink = styled(Link)`
  color: #6c63ff;
  font-weight: 500;
  font-size: 1.05rem;
  margin-top: 2.2rem;
  display: inline-block;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const SummaryTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 1.2rem;
`;

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.1rem;
  font-size: 1.05rem;
  color: #222;
`;

const SummaryLabel = styled.div`
  color: #888;
  font-size: 1.01rem;
  margin-right: 0.5rem;
`;

const SummaryValue = styled.div`
  color: #222;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
`;

const PromoInput = styled.input`
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 0.7rem;
  border: 1.5px solid #ececec;
  font-size: 1rem;
  margin-bottom: 0.7rem;
`;

const ApplyBtn = styled.button`
  width: 100%;
  background: #ff6b35;
  color: #fff;
  border: none;
  border-radius: 0.7rem;
  font-weight: 600;
  font-size: 1.05rem;
  padding: 0.7rem 0;
  margin-bottom: 1.2rem;
  cursor: pointer;
  transition: background 0.18s;
  &:hover {
    background: #ffb347;
  }
`;

const CheckoutBtn = styled.button`
  width: 100%;
  background: #6c63ff;
  color: #fff;
  border: none;
  border-radius: 0.7rem;
  font-weight: 700;
  font-size: 1.15rem;
  padding: 1rem 0;
  margin-top: 1.2rem;
  cursor: pointer;
  transition: background 0.18s;
  &:hover {
    background: #4834d4;
  }
`;

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const {cartItems} = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({...product, qty}));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  // For demo, shipping and promo are static
  const baseShipping = 5.0;
  const taxRate = 0.08; // 8% tax for demo
  const [promo, setPromo] = React.useState('');
  const [appliedPromo, setAppliedPromo] = React.useState('');
  const [promoError, setPromoError] = React.useState('');
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );
  const shippingCost = subtotal >= 100 ? 0 : baseShipping;
  const tax = subtotal * taxRate;
  const promoApplied =
    cart.promoCode && cart.promoCode.trim().toUpperCase() === 'HIRE ME';
  const discount = promoApplied ? subtotal + shippingCost + tax : 0;
  const total = promoApplied ? 0 : subtotal + shippingCost + tax - discount;

  const handleApplyPromo = () => {
    if (promo.trim().toUpperCase() === 'HIRE ME') {
      setAppliedPromo(promo.trim());
      dispatch(setPromoCode(promo.trim()));
      setPromoError('');
    } else {
      setAppliedPromo(promo.trim());
      dispatch(setPromoCode(''));
      setPromoError('Invalid promo code');
    }
  };

  React.useEffect(() => {
    setPromoError('');
  }, [promo]);

  return (
    <PageBg>
      <CartContainer>
        <CartLeft>
          <CartTitleRow>
            <CartTitle>Shopping Cart</CartTitle>
            <CartCount>
              {cartItems.length} Item{cartItems.length !== 1 ? 's' : ''}
            </CartCount>
          </CartTitleRow>
          {cartItems.length === 0 ? (
            <Message>
              Your cart is empty <Link to='/'>Go Back</Link>
            </Message>
          ) : (
            <CartTable>
              <thead>
                <tr>
                  <CartTh>PRODUCT DETAILS</CartTh>
                  <CartTh>QUANTITY</CartTh>
                  <CartTh>PRICE</CartTh>
                  <CartTh>TOTAL</CartTh>
                  <CartTh></CartTh>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item._id}>
                    <CartTd>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1.1rem',
                        }}
                      >
                        <ProductImg
                          src={item.image}
                          alt={item.name}
                        />
                        <div>
                          <ProductName to={`/product/${item._id}`}>
                            {item.name}
                          </ProductName>
                          <ProductSub>{item.team || item.category}</ProductSub>
                          <RemoveLink
                            onClick={() => removeFromCartHandler(item._id)}
                          >
                            Remove
                          </RemoveLink>
                        </div>
                      </div>
                    </CartTd>
                    <CartTd>
                      <QtyControl>
                        <QtyBtn
                          onClick={() =>
                            item.qty > 1 && addToCartHandler(item, item.qty - 1)
                          }
                          aria-label='Decrease quantity'
                        >
                          –
                        </QtyBtn>
                        <QtyNum>{item.qty}</QtyNum>
                        <QtyBtn
                          onClick={() =>
                            item.qty < item.countInStock &&
                            addToCartHandler(item, item.qty + 1)
                          }
                          aria-label='Increase quantity'
                        >
                          +
                        </QtyBtn>
                      </QtyControl>
                    </CartTd>
                    <CartTd>{`$${item.price.toFixed(2)}`}</CartTd>
                    <CartTd>{`$${(item.price * item.qty).toFixed(2)}`}</CartTd>
                    <CartTd>
                      <RemoveLink
                        onClick={() => removeFromCartHandler(item._id)}
                      >
                        <FaTrash />
                      </RemoveLink>
                    </CartTd>
                  </tr>
                ))}
              </tbody>
            </CartTable>
          )}
          <ContinueLink to='/'>← Continue Shopping</ContinueLink>
        </CartLeft>
        <CartRight>
          <SummaryTitle>Order Summary</SummaryTitle>
          <SummaryRow>
            <SummaryLabel>SUBTOTAL:</SummaryLabel>
            <SummaryValue>{`$${subtotal.toFixed(2)}`}</SummaryValue>
          </SummaryRow>
          <SummaryRow>
            <SummaryLabel>SHIPPING:</SummaryLabel>
            <SummaryValue>
              {shippingCost === 0 ? (
                <span style={{color: '#28a745', fontWeight: 600}}>FREE</span>
              ) : (
                `$${shippingCost.toFixed(2)}`
              )}
            </SummaryValue>
          </SummaryRow>
          <SummaryRow>
            <SummaryLabel>EST. TAX (8%):</SummaryLabel>
            <SummaryValue>{`$${tax.toFixed(2)}`}</SummaryValue>
          </SummaryRow>
          {promoApplied && (
            <SummaryRow>
              <SummaryLabel>PROMO APPLIED:</SummaryLabel>
              <SummaryValue style={{color: '#ff6b35', fontWeight: 600}}>
                - ${(subtotal + shippingCost + tax).toFixed(2)}
              </SummaryValue>
            </SummaryRow>
          )}
          <SummaryLabel style={{margin: '1.2rem 0 0.5rem 0'}}>
            PROMO CODE
          </SummaryLabel>
          <PromoInput
            type='text'
            placeholder='Enter your code'
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
          />
          <ApplyBtn
            type='button'
            disabled={
              promoApplied && appliedPromo.trim().toUpperCase() === 'HIRE ME'
            }
            onClick={handleApplyPromo}
          >
            APPLY
          </ApplyBtn>
          {promoError && (
            <div
              style={{color: 'red', marginBottom: '1rem', fontSize: '0.98rem'}}
            >
              {promoError}
            </div>
          )}
          <SummaryRow
            style={{
              fontWeight: 700,
              fontSize: '1.13rem',
              borderTop: '1.5px solid #ececec',
              paddingTop: '1.2rem',
              marginTop: '1.2rem',
            }}
          >
            <SummaryLabel>TOTAL COST:</SummaryLabel>
            <SummaryValue>{`$${total.toFixed(2)}`}</SummaryValue>
          </SummaryRow>
          <CheckoutBtn
            type='button'
            disabled={cartItems.length === 0}
            onClick={checkoutHandler}
          >
            CHECKOUT
          </CheckoutBtn>
        </CartRight>
      </CartContainer>
    </PageBg>
  );
};

export default CartScreen;
