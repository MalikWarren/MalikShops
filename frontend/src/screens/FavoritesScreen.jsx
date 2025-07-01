import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Row, Col, Button} from 'react-bootstrap';
import styled from 'styled-components';
import {FaHeart, FaTrash, FaShoppingCart} from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import Meta from '../components/Meta';
import {clearFavorites} from '../slices/favoritesSlice';
import {addToCart} from '../slices/cartSlice';

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
  margin-bottom: 1rem;
`;

const FavoritesCount = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--wnba-orange);
  margin-bottom: 2rem;
`;

const EmptyContainer = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  color: var(--gray-400);
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--gray-700);
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  color: var(--gray-600);
  margin-bottom: 2rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
`;

const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const FavoritesScreen = () => {
  const dispatch = useDispatch();
  const {favorites} = useSelector((state) => state.favorites);
  const {cartItems} = useSelector((state) => state.cart);

  // Immediately scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const clearAllFavorites = () => {
    if (window.confirm('Are you sure you want to remove all favorites?')) {
      dispatch(clearFavorites());
    }
  };

  const addAllToCart = () => {
    favorites.forEach((product) => {
      const existItem = cartItems.find((x) => x._id === product._id);
      const qty = existItem ? existItem.qty + 1 : 1;
      dispatch(addToCart({...product, qty}));
    });
  };

  if (favorites.length === 0) {
    return (
      <Container>
        <Meta
          title='My Favorites | WNBA Jersey Store'
          description='View and manage your favorite WNBA jerseys.'
          keywords='favorites, saved jerseys, WNBA jerseys'
        />

        <PageHeader>
          <PageTitle>My Favorites</PageTitle>
          <PageSubtitle>Your saved WNBA jerseys</PageSubtitle>
        </PageHeader>

        <EmptyContainer>
          <EmptyIcon>
            <FaHeart />
          </EmptyIcon>
          <EmptyTitle>No favorites yet</EmptyTitle>
          <EmptyText>
            Start adding jerseys to your favorites by clicking the heart icon on
            any jersey.
          </EmptyText>
          <ActionButton
            as='a'
            href='/products'
            variant='primary'
          >
            <FaShoppingCart />
            Browse Jerseys
          </ActionButton>
        </EmptyContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Meta
        title='My Favorites | WNBA Jersey Store'
        description='View and manage your favorite WNBA jerseys.'
        keywords='favorites, saved jerseys, WNBA jerseys'
      />

      <PageHeader>
        <PageTitle>My Favorites</PageTitle>
        <PageSubtitle>Your saved WNBA jerseys</PageSubtitle>
        <FavoritesCount>
          {favorites.length} {favorites.length === 1 ? 'jersey' : 'jerseys'}{' '}
          saved
        </FavoritesCount>
      </PageHeader>

      <ActionButtons>
        <ActionButton
          onClick={addAllToCart}
          variant='primary'
        >
          <FaShoppingCart />
          Add All to Cart
        </ActionButton>
        <ActionButton
          onClick={clearAllFavorites}
          variant='outline-danger'
        >
          <FaTrash />
          Clear All Favorites
        </ActionButton>
      </ActionButtons>

      <ProductGrid>
        {favorites.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </ProductGrid>
    </Container>
  );
};

export default FavoritesScreen;
