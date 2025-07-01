import React, {useState, useEffect} from 'react';
import {Row, Col} from 'react-bootstrap';
import styled from 'styled-components';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Meta from '../components/Meta';

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const PageSubtitle = styled.p`
  font-size: 1.1rem;
  color: var(--gray-600);
  margin-bottom: 0;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--red-600);
  font-size: 1.1rem;
`;

const NoProductsContainer = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const NoProductsTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--gray-700);
  margin-bottom: 1rem;
`;

const NoProductsText = styled.p`
  color: var(--gray-600);
  margin-bottom: 0;
`;

const FeaturedScreen = () => {
  const [featuredJerseys, setFeaturedJerseys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedJerseys = async () => {
      try {
        console.log('Fetching featured jerseys...');
        const {data} = await axios.get('/api/products/top-selling');
        console.log('Featured jerseys response:', data);

        // If no featured jerseys found, try to get some products
        if (!data || data.length === 0) {
          console.log('No featured jerseys found, fetching some products...');
          const {data: productsData} = await axios.get(
            '/api/products?pageNumber=1&pageSize=12'
          );
          console.log('Products response:', productsData);
          setFeaturedJerseys(productsData.products || []);
        } else {
          setFeaturedJerseys(data);
        }
      } catch (err) {
        console.error('Error fetching featured jerseys:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedJerseys();
  }, []);

  if (loading) {
    return (
      <LoadingSpinner>
        <div className='spinner'></div>
      </LoadingSpinner>
    );
  }

  if (error) {
    return <ErrorMessage>Error loading featured jerseys: {error}</ErrorMessage>;
  }

  return (
    <Container>
      <Meta
        title='Featured WNBA Jerseys | WNBA Jersey Store'
        description='Discover the most popular and featured WNBA jerseys from top players and teams.'
        keywords='featured WNBA jerseys, popular jerseys, top selling jerseys'
      />

      <PageHeader>
        <PageTitle>Featured Jerseys</PageTitle>
        <PageSubtitle>
          Discover the most popular WNBA jerseys from your favorite teams and
          players
        </PageSubtitle>
      </PageHeader>

      {featuredJerseys.length === 0 ? (
        <NoProductsContainer>
          <NoProductsTitle>No featured jerseys found</NoProductsTitle>
          <NoProductsText>
            We couldn't find any featured jerseys at the moment. Please check
            back later.
          </NoProductsText>
        </NoProductsContainer>
      ) : (
        <div className='headshot-grid'>
          {featuredJerseys.map((jersey) => (
            <ProductCard
              key={jersey._id}
              product={jersey}
            />
          ))}
        </div>
      )}
    </Container>
  );
};

export default FeaturedScreen;
