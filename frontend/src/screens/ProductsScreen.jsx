import React from 'react';
import {useParams} from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Paginate from '../components/Paginate';
import {useGetProductsQuery} from '../slices/productsApiSlice';
import Meta from '../components/Meta';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ProductsScreen = () => {
  const {pageNumber} = useParams();
  const page = pageNumber ? Number(pageNumber) : 1;

  const {data, isLoading, error} = useGetProductsQuery({pageNumber: page});

  if (isLoading) {
    return (
      <>
        <Meta title='Loading Products | WNBA Jersey Store' />
        <h1>All WNBA Jerseys</h1>
        <Loader />
      </>
    );
  }

  if (error) {
    console.error('ProductsScreen - Error details:', error);
    return (
      <>
        <Meta title='Error | WNBA Jersey Store' />
        <h1>All WNBA Jerseys</h1>
        <Message variant='danger'>
          {error?.data?.message || error?.message || 'Failed to load products'}
        </Message>
      </>
    );
  }

  // Check if data is valid
  if (!data || !data.products) {
    console.error('ProductsScreen - Invalid data structure:', data);
    return (
      <>
        <Meta title='Error | WNBA Jersey Store' />
        <h1>All WNBA Jerseys</h1>
        <Message variant='danger'>
          Invalid data received from server. Please try refreshing the page.
        </Message>
      </>
    );
  }

  return (
    <>
      <Meta title='All WNBA Jerseys | WNBA Jersey Store' />
      <h1
        style={{
          fontWeight: 800,
          fontSize: '2.2rem',
          margin: '2rem 0 1.5rem 0',
          textAlign: 'center',
        }}
      >
        All WNBA Jerseys
      </h1>
      <div className='headshots-grid'>
        {data.products && data.products.length > 0 ? (
          data.products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))
        ) : (
          <div style={{textAlign: 'center', padding: '2rem'}}>
            <p style={{color: 'var(--gray-600)', fontSize: '1.1rem'}}>
              No products found on page {page}.
            </p>
          </div>
        )}
      </div>
      {data.pages > 1 && (
        <div
          style={{margin: '2rem 0', display: 'flex', justifyContent: 'center'}}
        >
          <Paginate
            pages={data.pages}
            page={data.page}
          />
        </div>
      )}
    </>
  );
};

export default ProductsScreen;
