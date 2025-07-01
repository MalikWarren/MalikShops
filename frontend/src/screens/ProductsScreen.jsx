import React from 'react';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import ProductCard from '../components/ProductCard';
import Paginate from '../components/Paginate';
import {useGetProductsQuery} from '../slices/productsApiSlice';
import Meta from '../components/Meta';
import Loader from '../components/Loader';
import Message from '../components/Message';

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  background: white;
  border-radius: 1.5rem;
  padding: 3rem 2rem;
  margin: 0 auto 3rem auto;
  max-width: 800px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--wnba-orange), #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const PageSubtitle = styled.p`
  font-size: 1.2rem;
  color: var(--gray-600);
  margin-bottom: 0;
  font-weight: 500;
`;

const ProductsGrid = styled.div`
  display: grid !important;
  grid-template-columns: repeat(5, 1fr) !important;
  gap: 1.5rem;
  margin: 1rem 0;
  padding: 0.5rem 0;
  background: white;
  border-radius: 1.5rem;
  padding: 2.5rem;
  margin: 2rem auto;
  max-width: 1200px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);

  /* Force cards to be uniform size */
  & > * {
    min-height: 380px;
  }

  @media (max-width: 1200px) {
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 1.25rem;
    & > * {
      min-height: 360px;
    }
  }

  @media (max-width: 992px) {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 1rem;
    & > * {
      min-height: 340px;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 1rem;
    & > * {
      min-height: 320px;
    }
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr) !important;
    gap: 0.75rem;
    & > * {
      min-height: 300px;
    }
  }
`;

const NoProductsContainer = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1.5rem;
  margin: 2rem auto;
  max-width: 600px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const NoProductsText = styled.p`
  color: var(--gray-600);
  font-size: 1.1rem;
  margin-bottom: 0;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 2rem 0;
`;

const ProductsScreen = () => {
  const {pageNumber} = useParams();
  const page = pageNumber ? Number(pageNumber) : 1;

  const {data, isLoading, error} = useGetProductsQuery({pageNumber: page});

  if (isLoading) {
    return (
      <Container>
        <Meta title='Loading Products | WNBA Jersey Store' />
        <PageHeader>
          <PageTitle>All WNBA Jerseys</PageTitle>
          <PageSubtitle>
            Browse our complete collection of official WNBA jerseys
          </PageSubtitle>
        </PageHeader>
        <Loader />
      </Container>
    );
  }

  if (error) {
    console.error('ProductsScreen - Error details:', error);
    return (
      <Container>
        <Meta title='Error | WNBA Jersey Store' />
        <PageHeader>
          <PageTitle>All WNBA Jerseys</PageTitle>
          <PageSubtitle>
            Browse our complete collection of official WNBA jerseys
          </PageSubtitle>
        </PageHeader>
        <Message variant='danger'>
          {error?.data?.message || error?.message || 'Failed to load products'}
        </Message>
      </Container>
    );
  }

  // Check if data is valid
  if (!data || !data.products) {
    console.error('ProductsScreen - Invalid data structure:', data);
    return (
      <Container>
        <Meta title='Error | WNBA Jersey Store' />
        <PageHeader>
          <PageTitle>All WNBA Jerseys</PageTitle>
          <PageSubtitle>
            Browse our complete collection of official WNBA jerseys
          </PageSubtitle>
        </PageHeader>
        <Message variant='danger'>
          Invalid data received from server. Please try refreshing the page.
        </Message>
      </Container>
    );
  }

  return (
    <Container>
      <Meta title='All WNBA Jerseys | WNBA Jersey Store' />
      <PageHeader>
        <PageTitle>All WNBA Jerseys</PageTitle>
        <PageSubtitle>
          Browse our complete collection of official WNBA jerseys
        </PageSubtitle>
      </PageHeader>

      {data.products && data.products.length > 0 ? (
        <ProductsGrid>
          {data.products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </ProductsGrid>
      ) : (
        <NoProductsContainer>
          <NoProductsText>No products found on page {page}.</NoProductsText>
        </NoProductsContainer>
      )}

      {data.pages > 1 && (
        <PaginationContainer>
          <Paginate
            pages={data.pages}
            page={data.page}
          />
        </PaginationContainer>
      )}
    </Container>
  );
};

export default ProductsScreen;
