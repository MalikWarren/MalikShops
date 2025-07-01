import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Container} from 'react-bootstrap';
import {PayPalScriptProvider} from '@paypal/react-paypal-js';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import UserListScreen from './screens/admin/UserListScreen';
import UserEditScreen from './screens/admin/UserEditScreen';
import ProductListScreen from './screens/admin/ProductListScreen';
import ProductEditScreen from './screens/admin/ProductEditScreen';
import ProductCreateScreen from './screens/admin/ProductCreateScreen';
import OrderListScreen from './screens/admin/OrderListScreen';
import AdminRoute from './components/AdminRoute';
import SearchScreen from './screens/SearchScreen';
import ProductsScreen from './screens/ProductsScreen';
import TeamsScreen from './screens/TeamsScreen';
import TeamPage from './screens/TeamPage';
import FeaturedScreen from './screens/FeaturedScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import PlayerPage from './screens/PlayerPage';

import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <PayPalScriptProvider deferLoading={true}>
      <Router>
        <ToastContainer />
        <Header />
        <main
          className='py-3'
          style={{marginTop: '65px', marginBottom: '2rem'}}
        >
          <Container>
            <Routes>
              <Route
                path='/'
                element={<HomeScreen />}
              />
              <Route
                path='/search'
                element={<SearchScreen />}
              />
              <Route
                path='/search/:keyword'
                element={<SearchScreen />}
              />
              <Route
                path='/login'
                element={<LoginScreen />}
              />
              <Route
                path='/register'
                element={<RegisterScreen />}
              />
              <Route
                path='/profile'
                element={<ProfileScreen />}
              />
              <Route
                path='/product/:id'
                element={<ProductScreen />}
              />
              <Route
                path='/cart'
                element={<CartScreen />}
              />
              <Route
                path='/shipping'
                element={<ShippingScreen />}
              />
              <Route
                path='/payment'
                element={<PaymentScreen />}
              />
              <Route
                path='/placeorder'
                element={<PlaceOrderScreen />}
              />
              <Route
                path='/order/:id'
                element={<OrderScreen />}
              />

              {/* Admin Routes */}
              <Route
                path='/admin'
                element={<AdminRoute />}
              >
                <Route
                  path='userlist'
                  element={<UserListScreen />}
                />
                <Route
                  path='user/:id/edit'
                  element={<UserEditScreen />}
                />
                <Route
                  path='productlist'
                  element={<ProductListScreen />}
                />
                <Route
                  path='product/:id/edit'
                  element={<ProductEditScreen />}
                />
                <Route
                  path='product/create'
                  element={<ProductCreateScreen />}
                />
                <Route
                  path='orderlist'
                  element={<OrderListScreen />}
                />
              </Route>

              <Route
                path='/products'
                element={<ProductsScreen />}
              />
              <Route
                path='/products/page/:pageNumber'
                element={<ProductsScreen />}
              />
              <Route
                path='/teams'
                element={<TeamsScreen />}
              />
              <Route
                path='/team/:teamName'
                element={<TeamPage />}
              />
              <Route
                path='/featured'
                element={<FeaturedScreen />}
              />
              <Route
                path='/favorites'
                element={<FavoritesScreen />}
              />
              <Route
                path='/player/:playerId'
                element={<PlayerPage />}
              />
            </Routes>
          </Container>
        </main>
        <Footer />
      </Router>
    </PayPalScriptProvider>
  );
};

export default App;
