import {Table, Button, Row, Col, Form} from 'react-bootstrap';
import {FaEdit, FaPlus, FaTrash, FaSearch} from 'react-icons/fa';
import {Link, useSearchParams, useNavigate} from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from '../../slices/productsApiSlice';
import {toast} from 'react-toastify';
import {useState, useEffect} from 'react';

const ProductListScreen = () => {
  const [searchParams] = useSearchParams();
  const pageNumber = searchParams.get('page');
  const keyword = searchParams.get('keyword') || '';
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(keyword);

  const page = pageNumber ? Number(pageNumber) : 1;

  const {data, isLoading, error, refetch} = useGetProductsQuery({
    pageNumber: page,
    keyword: keyword,
  });

  const [deleteProduct, {isLoading: loadingDelete}] =
    useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure')) {
      try {
        await deleteProduct(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const createProductHandler = () => {
    navigate('/admin/product/create');
  };

  const submitSearchHandler = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/admin/productlist?keyword=${searchTerm.trim()}`);
    } else {
      navigate('/admin/productlist');
    }
  };

  const clearSearchHandler = () => {
    setSearchTerm('');
    navigate('/admin/productlist');
  };

  return (
    <>
      <Row
        className='align-items-center'
        style={{marginBottom: '2rem', marginTop: '1rem'}}
      >
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-end'>
          <Button
            className='my-3'
            onClick={createProductHandler}
          >
            <FaPlus /> Create Product
          </Button>
        </Col>
      </Row>

      {/* Search Form */}
      <Row className='mb-3'>
        <Col md={6}>
          <Form onSubmit={submitSearchHandler}>
            <Row>
              <Col md={8}>
                <Form.Control
                  type='text'
                  placeholder='Search products by name, team, or player...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>
              <Col md={4}>
                <div className='d-flex gap-2'>
                  <Button
                    type='submit'
                    variant='primary'
                    className='flex-fill'
                  >
                    <FaSearch /> Search
                  </Button>
                  {keyword && (
                    <Button
                      variant='outline-secondary'
                      onClick={clearSearchHandler}
                      title='Clear search'
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          </Form>
        </Col>
        {keyword && (
          <Col
            md={6}
            className='d-flex align-items-center'
          >
            <span className='text-muted'>
              Search results for: <strong>"{keyword}"</strong>
            </span>
          </Col>
        )}
      </Row>

      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error.data.message}</Message>
      ) : (
        <>
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
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <Button
                      as={Link}
                      to={`/admin/product/${product._id}/edit`}
                      variant='light'
                      className='btn-sm mx-2'
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FaTrash style={{color: 'white'}} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate
            pages={data.pages}
            page={data.page}
            isAdmin={true}
            keyword={keyword}
          />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
