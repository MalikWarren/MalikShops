import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {LinkContainer} from 'react-router-bootstrap';
import {Table, Button, Row, Col} from 'react-bootstrap';
import {FaTrash, FaEdit, FaCheck, FaTimes} from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from '../../slices/usersApiSlice';
import {toast} from 'react-toastify';
import {Link} from 'react-router-dom';

const UserListScreen = () => {
  const {data: users, refetch, isLoading, error} = useGetUsersQuery();
  const [deleteUser, {isLoading: loadingDelete}] = useDeleteUserMutation();

  const deleteHandler = async (id, isAdmin) => {
    if (isAdmin) {
      toast.error('Cannot delete admin users');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        console.log('Attempting to delete user with ID:', id);
        const result = await deleteUser(id).unwrap();
        console.log('Delete result:', result);
        toast.success('User deleted successfully');
        refetch();
      } catch (err) {
        console.error('Delete user error:', err);
        toast.error(
          err?.data?.message || err?.error || 'Failed to delete user'
        );
      }
    }
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Users</h1>
        </Col>
      </Row>

      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
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
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <span style={{color: 'green', fontWeight: 'bold'}}>
                      ✓ Admin
                    </span>
                  ) : (
                    <span style={{color: 'red'}}>✗ User</span>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button
                      variant='info'
                      className='btn-sm me-2'
                    >
                      Edit
                    </Button>
                  </LinkContainer>
                  <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={() => deleteHandler(user._id, user.isAdmin)}
                    disabled={loadingDelete || user.isAdmin}
                    title={
                      user.isAdmin ? 'Cannot delete admin users' : 'Delete user'
                    }
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserListScreen;
