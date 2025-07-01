import React, {useEffect, useState} from 'react';
import {
  Table,
  Form,
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import {FaTimes} from 'react-icons/fa';
import {LinkContainer} from 'react-router-bootstrap';

import {toast} from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {useProfileMutation} from '../slices/usersApiSlice';
import {useGetMyOrdersQuery} from '../slices/ordersApiSlice';
import {setCredentials} from '../slices/authSlice';
import {Link} from 'react-router-dom';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const {userInfo} = useSelector((state) => state.auth);

  const {data: orders, isLoading, error} = useGetMyOrdersQuery();

  const [updateProfile, {isLoading: loadingUpdateProfile}] =
    useProfileMutation();

  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.name]);

  const dispatch = useDispatch();
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await updateProfile({
          // NOTE: here we don't need the _id in the request payload as this is
          // not used in our controller.
          // _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({...res}));
        toast.success('Profile updated successfully');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>

        <Form onSubmit={submitHandler}>
          <Form.Group
            className='my-2'
            controlId='name'
          >
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group
            className='my-2'
            controlId='email'
          >
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group
            className='my-2'
            controlId='password'
          >
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group
            className='my-2'
            controlId='confirmPassword'
          >
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button
            type='submit'
            variant='primary'
          >
            Update
          </Button>
          {loadingUpdateProfile && <Loader />}
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {isLoading ? (
          <Loader />
        ) : orders && orders.length > 0 ? (
          <Table
            striped
            bordered
            hover
            responsive
            className='table-sm'
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) =>
                order && order._id ? (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>
                      {order.createdAt
                        ? order.createdAt.substring(0, 10)
                        : 'N/A'}
                    </td>
                    <td>${order.totalPrice || 0}</td>
                    <td>
                      {order.isPaid ? (
                        order.paidAt ? (
                          order.paidAt.substring(0, 10)
                        ) : (
                          'Paid'
                        )
                      ) : (
                        <i
                          className='fas fa-times'
                          style={{color: 'red'}}
                        ></i>
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        order.deliveredAt ? (
                          order.deliveredAt.substring(0, 10)
                        ) : (
                          'Delivered'
                        )
                      ) : (
                        <i
                          className='fas fa-times'
                          style={{color: 'red'}}
                        ></i>
                      )}
                    </td>
                    <td>
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button
                          className='btn-sm'
                          variant='light'
                        >
                          Details
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ) : null
              )}
            </tbody>
          </Table>
        ) : (
          <div style={{textAlign: 'center', padding: '2rem'}}>
            <p style={{color: 'var(--gray-600)', fontSize: '1.1rem'}}>
              You haven't placed any orders yet.
              <br />
              <Link
                to='/products'
                style={{color: 'var(--wnba-orange)', textDecoration: 'none'}}
              >
                Start shopping for WNBA jerseys!
              </Link>
            </p>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
