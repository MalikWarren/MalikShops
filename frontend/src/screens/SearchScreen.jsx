import React from 'react';
import {useSearchParams, useParams} from 'react-router-dom';
import {Row, Col} from 'react-bootstrap';
import {useGetProductsQuery} from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';

const SearchScreen = () => {
  const [searchParams] = useSearchParams();
  const {keyword} = useParams();

  // Handle both URL patterns: /search?q=keyword and /search/keyword
  const searchTerm = keyword || searchParams.get('q') || '';

  const {data: products, isLoading, error} = useGetProductsQuery();

  console.log('SearchScreen - searchTerm:', searchTerm);
  console.log('SearchScreen - products:', products);
  console.log('SearchScreen - isLoading:', isLoading);
  console.log('SearchScreen - error:', error);

  // Filter products based on search term
  const filteredProducts =
    products?.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description &&
          product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (product.category &&
          product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.player &&
          product.player.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.team &&
          product.team.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [];

  console.log('SearchScreen - filteredProducts:', filteredProducts);

  return (
    <>
      <Meta title={`Search: ${searchTerm}`} />

      <Row className='mb-3'>
        <Col>
          <h1>Search Results</h1>
          <p>Searching for: "{searchTerm}"</p>
          <p>Total products: {products?.length || 0}</p>
          <p>Filtered products: {filteredProducts.length}</p>
        </Col>
      </Row>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          {filteredProducts.length > 0 ? (
            <>
              <Row className='mb-3'>
                <Col>
                  <Message variant='info'>
                    Found {filteredProducts.length} product
                    {filteredProducts.length !== 1 ? 's' : ''} matching "
                    {searchTerm}"
                  </Message>
                </Col>
              </Row>
              <Row>
                {filteredProducts.map((product) => (
                  <Col
                    key={product._id}
                    sm={12}
                    md={6}
                    lg={4}
                    xl={3}
                  >
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
            </>
          ) : searchTerm ? (
            <Message variant='warning'>
              No products found matching "{searchTerm}". Try a different search
              term.
            </Message>
          ) : (
            <Message variant='info'>
              Enter a search term to find products.
            </Message>
          )}
        </>
      )}
    </>
  );
};

export default SearchScreen;
