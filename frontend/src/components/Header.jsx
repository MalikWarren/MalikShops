import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Navbar, Nav, Container, NavDropdown, Badge} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import {logout} from '../slices/authSlice';
import {FaHeart, FaShoppingCart, FaUser} from 'react-icons/fa';
import SearchBox from './SearchBox';

const Header = () => {
  const dispatch = useDispatch();

  // Add null check for the state
  const auth = useSelector((state) => state.auth);
  const userInfo = auth ? auth.userInfo : null;

  const {cartItems} = useSelector((state) => state.cart);
  const {favorites} = useSelector((state) => state.favorites);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const favoritesCount = favorites.length;

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      <Navbar
        bg='white'
        variant='light'
        expand='lg'
        className='shadow-sm py-1'
        style={{
          borderBottom: '1px solid #eee',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1050,
          marginBottom: '1rem',
        }}
      >
        <Container fluid>
          {/* Left: Navigation */}
          <Nav
            className='d-none d-lg-flex align-items-center'
            style={{flex: 1}}
          >
            <LinkContainer to='/'>
              <Nav.Link className='mx-2 fw-semibold text-dark'>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to='/products'>
              <Nav.Link className='mx-2 fw-semibold text-dark'>
                Jerseys
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to='/teams'>
              <Nav.Link className='mx-2 fw-semibold text-dark'>Teams</Nav.Link>
            </LinkContainer>
            <LinkContainer to='/featured'>
              <Nav.Link className='mx-2 fw-semibold text-dark'>
                Featured
              </Nav.Link>
            </LinkContainer>
          </Nav>

          {/* Right: Search, Favorites, Cart, User */}
          <div
            className='d-flex align-items-center'
            style={{flex: 1, justifyContent: 'flex-end'}}
          >
            {/* Search Box with Suggestions */}
            <div style={{minWidth: 250, maxWidth: 300, marginRight: '1rem'}}>
              <SearchBox />
            </div>

            {/* Favorites Icon */}
            <LinkContainer to='/favorites'>
              <Nav.Link className='position-relative mx-2'>
                <FaHeart
                  size={20}
                  style={{color: '#ff6b35'}}
                />
                {favoritesCount > 0 && (
                  <Badge
                    bg='danger'
                    pill
                    className='position-absolute top-0 start-100 translate-middle'
                  >
                    {favoritesCount}
                  </Badge>
                )}
              </Nav.Link>
            </LinkContainer>

            {/* Cart Icon */}
            <LinkContainer to='/cart'>
              <Nav.Link className='position-relative mx-2'>
                <FaShoppingCart
                  size={20}
                  style={{color: '#222'}}
                />
                {cartCount > 0 && (
                  <Badge
                    bg='danger'
                    pill
                    className='position-absolute top-0 start-100 translate-middle'
                  >
                    {cartCount}
                  </Badge>
                )}
              </Nav.Link>
            </LinkContainer>

            {/* User Dropdown */}
            {userInfo ? (
              <NavDropdown
                title={<span className='fw-semibold'>{userInfo.name}</span>}
                id='username'
                align='end'
              >
                <LinkContainer to='/profile'>
                  <NavDropdown.Item>Profile</NavDropdown.Item>
                </LinkContainer>
                {userInfo.isAdmin && (
                  <>
                    <LinkContainer to='/admin/userlist'>
                      <NavDropdown.Item>Users</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/admin/productlist'>
                      <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/admin/orderlist'>
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                  </>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logoutHandler}>
                  Sign Out
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <LinkContainer to='/login'>
                <Nav.Link className='fw-semibold mx-2'>
                  <FaUser size={18} /> Sign In
                </Nav.Link>
              </LinkContainer>
            )}
          </div>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
