import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import {PayPalScriptProvider} from '@paypal/react-paypal-js';
import {Provider} from 'react-redux';
import store from './store';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductListScreen from './screens/admin/ProductListScreen';
import './assets/styles/bootstrap.custom.css';
import './assets/styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import HomeScreen from './screens/HomeScreen';
import PrivateRoutes from './components/PrivateRoutes';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import AdminRoute from './components/AdminRoutes';
import OrderListScreen from './screens/admin/OrderListScreen';
import ProductEditScreen from './screens/admin/ProductEditScreen';
import UserListScreen from './screens/admin/UserListScreen';
import UserEditScreen from './screens/admin/UserEditScreen';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path='/'
      element={<App />}
    >
      <Route
        index={true}
        path='/'
        element={<HomeScreen />}
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
        path='/login'
        element={<LoginScreen />}
      />
      <Route
        path='/register'
        element={<RegisterScreen />}
      />

      <Route
        path=''
        element={<PrivateRoutes />}
      >
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
        <Route
          path='/profile'
          element={<ProfileScreen />}
        />
      </Route>

      <Route
        path=''
        element={<AdminRoute />}
      >
        <Route
          path='/admin/orderlist'
          element={<OrderListScreen />}
        />
        <Route
          path='/admin/productList'
          element={<ProductListScreen />}
        />
        <Route
          path='/admin/product/:id/edit'
          element={<ProductEditScreen />}
        />
        <Route
          path='/admin/userlist'
          element={<UserListScreen />}
        />
        <Route
          path='/admin/user/:id/edit'
          element={<UserEditScreen />}
        />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider deferLoading={true}>
        <RouterProvider router={router} />
      </PayPalScriptProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
