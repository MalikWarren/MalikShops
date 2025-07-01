import React, {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import {Row, Col, Form} from 'react-bootstrap';
import styled from 'styled-components';
import axios from 'axios';
import HeroSection from '../components/HeroSection';
import ProductCarousel from '../components/ProductCarousel';
import TeamScrollBar from '../components/TeamScrollBar';
import ProductCard from '../components/ProductCard';
import Paginate from '../components/Paginate';
import {
  FaFire,
  FaStar,
  FaArrowRight,
  FaBasketballBall,
  FaSearch,
} from 'react-icons/fa';
import Meta from '../components/Meta';
import {useGetProductsQuery} from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';

const Container = styled.div`
  min-height: 100vh;
`;

const Section = styled.section`
  padding: 4rem 0;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SectionSubtitle = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: var(--gray-600);
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ViewAllButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: var(--gradient-primary);
  color: var(--white);
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-md);
  margin-top: 2rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    color: var(--white);
    text-decoration: none;
  }
`;

const StatsSection = styled.div`
  background: var(--white);
  padding: 3rem 0;
  margin: 2rem 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 2rem;
  background: var(--gray-50);
  border-radius: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
`;

const StatIcon = styled.div`
  font-size: 3rem;
  color: var(--wnba-orange);
  margin-bottom: 1rem;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: var(--gray-600);
  font-weight: 500;
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

const SearchResultsContainer = styled.div`
  padding: 2rem 0;
`;

const SearchHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const SearchTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SearchSubtitle = styled.p`
  font-size: 1.1rem;
  color: var(--gray-600);
  margin-bottom: 0;
`;

const SearchKeyword = styled.span`
  color: var(--wnba-orange);
  font-weight: 600;
`;

const NoResultsContainer = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const NoResultsIcon = styled.div`
  font-size: 4rem;
  color: var(--gray-400);
  margin-bottom: 1rem;
`;

const NoResultsTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--gray-700);
  margin-bottom: 1rem;
`;

const NoResultsText = styled.p`
  color: var(--gray-600);
  margin-bottom: 2rem;
`;

const BackToHomeButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: var(--gradient-primary);
  color: var(--white);
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-md);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    color: var(--white);
    text-decoration: none;
  }
`;

const HomeScreen = () => {
  const {keyword: encodedKeyword, pageNumber} = useParams();
  const keyword = encodedKeyword ? decodeURIComponent(encodedKeyword) : null;
  const [topSellingJerseys, setTopSellingJerseys] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchPages, setSearchPages] = useState(0);
  const [searchPage, setSearchPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {data: products, isLoading, error: apiError} = useGetProductsQuery();

  useEffect(() => {
    const fetchTopSellingJerseys = async () => {
      try {
        const {data} = await axios.get('/api/products/top-selling');
        setTopSellingJerseys(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSellingJerseys();
  }, []);

  useEffect(() => {
    if (keyword) {
      const fetchSearchResults = async () => {
        setSearchLoading(true);
        setSearchError(null);
        try {
          const page = pageNumber || 1;
          const {data} = await axios.get(
            `/api/products?keyword=${encodeURIComponent(keyword)}&pageNumber=${page}`
          );
          setSearchResults(data.products);
          setSearchPages(data.pages);
          setSearchPage(data.page);
        } catch (err) {
          setSearchError(err.message);
        } finally {
          setSearchLoading(false);
        }
      };

      fetchSearchResults();
    }
  }, [keyword, pageNumber]);

  // If there's a search keyword, show search results
  if (keyword) {
    return (
      <Container>
        <Meta
          title={`Search Results for "${keyword}" | WNBA Jersey Store`}
          description={`Search results for "${keyword}" - Find WNBA jerseys, players, and teams.`}
          keywords={`${keyword}, WNBA jerseys, basketball jerseys, search results`}
        />

        <SearchResultsContainer>
          <SearchHeader>
            <SearchTitle>Search Results</SearchTitle>
            <SearchSubtitle>
              Results for <SearchKeyword>"{keyword}"</SearchKeyword>
            </SearchSubtitle>
          </SearchHeader>

          {searchLoading ? (
            <LoadingSpinner>
              <div className='spinner'></div>
            </LoadingSpinner>
          ) : searchError ? (
            <ErrorMessage>
              Error searching products:{' '}
              {searchError?.data?.message ||
                searchError?.message ||
                'Unknown search error'}
            </ErrorMessage>
          ) : searchResults.length === 0 ? (
            <NoResultsContainer>
              <NoResultsIcon>
                <FaSearch />
              </NoResultsIcon>
              <NoResultsTitle>No results found</NoResultsTitle>
              <NoResultsText>
                We couldn't find any jerseys matching "{keyword}". Try searching
                for a different player, team, or keyword.
              </NoResultsText>
              <BackToHomeButton to='/'>
                <FaArrowRight /> Back to Home
              </BackToHomeButton>
            </NoResultsContainer>
          ) : (
            <>
              <div className='headshot-grid'>
                {searchResults.map((jersey) => (
                  <ProductCard
                    key={jersey._id}
                    product={jersey}
                  />
                ))}
              </div>

              <div
                style={{
                  marginTop: '2rem',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Paginate
                  pages={searchPages}
                  page={searchPage}
                  keyword={encodedKeyword}
                />
              </div>
            </>
          )}
        </SearchResultsContainer>
      </Container>
    );
  }

  // Show regular homepage content
  if (loading) {
    return (
      <LoadingSpinner>
        <div className='spinner'></div>
      </LoadingSpinner>
    );
  }

  if (error) {
    return (
      <ErrorMessage>
        Error loading products:{' '}
        {error?.data?.message || error?.message || 'Unknown error'}
      </ErrorMessage>
    );
  }

  return (
    <Container>
      <Meta
        title='WNBA Jersey Store | Official WNBA Jerseys'
        description="Shop official WNBA jerseys from all teams. Find your favorite player's jersey and support your team."
        keywords='WNBA jerseys, basketball jerseys, WNBA store, official WNBA merchandise'
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Team Scroll Bar */}
      <TeamScrollBar />

      {/* Featured Jerseys Carousel */}
      <Section>
        <SectionTitle>Featured Jerseys</SectionTitle>
        <SectionSubtitle>
          Discover the most popular WNBA jerseys from your favorite teams and
          players
        </SectionSubtitle>
        <ProductCarousel />
      </Section>

      {/* Stats Section */}
      <StatsSection>
        <StatsGrid>
          <StatCard>
            <StatIcon>
              <FaBasketballBall />
            </StatIcon>
            <StatNumber>12</StatNumber>
            <StatLabel>WNBA Teams</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>
              <FaStar />
            </StatIcon>
            <StatNumber>36</StatNumber>
            <StatLabel>Top Players</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>
              <FaFire />
            </StatIcon>
            <StatNumber>100%</StatNumber>
            <StatLabel>Authentic</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>
              <FaStar />
            </StatIcon>
            <StatNumber>4.8</StatNumber>
            <StatLabel>Customer Rating</StatLabel>
          </StatCard>
        </StatsGrid>
      </StatsSection>

      {/* Top Selling Jerseys */}
      <section
        style={{
          background: 'var(--gray-50)',
          borderRadius: '1.5rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          padding: '2rem 1rem',
          margin: '2rem 0',
          border: '1px solid var(--gray-200)',
        }}
      >
        <h2
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            marginBottom: '1rem',
            textAlign: 'center',
            letterSpacing: '0.5px',
            color: 'var(--wnba-blue)',
          }}
        >
          Top Selling Jerseys
        </h2>
        <p
          style={{
            textAlign: 'center',
            color: 'var(--gray-600)',
            fontSize: '1.1rem',
            marginBottom: '2rem',
          }}
        >
          The most popular jerseys that fans love to wear
        </p>
        <div className='headshots-grid'>
          {topSellingJerseys && topSellingJerseys.length > 0 ? (
            topSellingJerseys.slice(0, 6).map((jersey) => (
              <ProductCard
                key={jersey._id}
                product={jersey}
                topSeller={true}
              />
            ))
          ) : (
            <div style={{textAlign: 'center', padding: '2rem'}}>
              <p style={{color: 'var(--gray-600)', fontSize: '1.1rem'}}>
                Loading top selling jerseys...
              </p>
            </div>
          )}
        </div>
        <div style={{textAlign: 'center', marginTop: '1.5rem'}}>
          <ViewAllButton to='/products'>
            View All Jerseys <FaArrowRight />
          </ViewAllButton>
        </div>
      </section>

      {/* Products Display */}
      {isLoading ? (
        <Loader />
      ) : (
        <Row>
          {products && products.length > 0 ? (
            products.map((product) => {
              // Debug: Check if product is an object
              if (typeof product !== 'object' || product === null) {
                console.error('Invalid product data:', product);
                return null;
              }
              return (
                <Col
                  key={product._id}
                  sm={12}
                  md={6}
                  lg={4}
                  xl={3}
                >
                  <Product product={product} />
                </Col>
              );
            })
          ) : (
            <Col>
              <div style={{textAlign: 'center', padding: '2rem'}}>
                <p style={{color: 'var(--gray-600)', fontSize: '1.1rem'}}>
                  No products available at the moment.
                </p>
              </div>
            </Col>
          )}
        </Row>
      )}
    </Container>
  );
};

export default HomeScreen;
