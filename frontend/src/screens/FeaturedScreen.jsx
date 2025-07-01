import React, {useState, useEffect} from 'react';
import {Row, Col} from 'react-bootstrap';
import styled from 'styled-components';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Meta from '../components/Meta';

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

const FeaturedGrid = styled.div`
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
  background: white;
  border-radius: 1rem;
  margin: 2rem auto;
  max-width: 600px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
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

const NoProductsTitle = styled.h2`
  font-size: 1.8rem;
  color: var(--gray-700);
  margin-bottom: 1rem;
  font-weight: 700;
`;

const NoProductsText = styled.p`
  color: var(--gray-600);
  margin-bottom: 0;
  font-size: 1.1rem;
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
        <FeaturedGrid>
          {featuredJerseys.map((jersey) => (
            <ProductCard
              key={jersey._id}
              product={jersey}
            />
          ))}
        </FeaturedGrid>
      )}
    </Container>
  );
};

export default FeaturedScreen;
