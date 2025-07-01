import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import {
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaArrowRight,
  FaFire,
  FaBasketballBall,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import {useDispatch, useSelector} from 'react-redux';
import {addToCart} from '../slices/cartSlice';
import {addToFavorites, removeFromFavorites} from '../slices/favoritesSlice';

const BannerContainer = styled.div`
  background: rgba(24, 26, 32, 0.92);
  border-radius: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  padding: 2.5rem 2rem;
  margin: 2.5rem 0;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  min-height: 340px;
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.08);
  @media (max-width: 900px) {
    flex-direction: column;
    min-height: 0;
    padding: 1.5rem 0.5rem;
  }
`;

const BannerLeft = styled.div`
  flex: 1.2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 2;
  padding-left: 2rem;
  @media (max-width: 900px) {
    padding-left: 1rem;
    padding-right: 1rem;
    align-items: center;
    text-align: center;
  }
`;

const BannerRight = styled.div`
  flex: 1.5;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  @media (max-width: 900px) {
    justify-content: center;
    margin-top: 2rem;
  }
`;

const JerseyImage = styled.img`
  max-height: 260px;
  max-width: 100%;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  background: rgba(0, 0, 0, 0.12);
  object-fit: contain;
  filter: brightness(1.05) drop-shadow(0 4px 24px #0008);
  @media (max-width: 900px) {
    max-height: 180px;
  }
`;

const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
  letter-spacing: 0.01em;
`;

const Meta = styled.div`
  color: #b0b3b8;
  font-size: 1rem;
  margin-bottom: 0.7rem;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex-wrap: wrap;
`;

const Description = styled.p`
  color: #e4e6eb;
  font-size: 1.08rem;
  margin-bottom: 1.2rem;
  max-width: 420px;
`;

const ShopButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  background: linear-gradient(90deg, #ff6b35 60%, #ffb347 100%);
  color: #fff;
  font-weight: 600;
  font-size: 1.1rem;
  border: none;
  border-radius: 2rem;
  padding: 0.9rem 2.2rem;
  margin-top: 0.5rem;
  box-shadow: 0 2px 12px #ff6b3533;
  text-decoration: none;
  transition:
    background 0.2s,
    transform 0.2s;
  &:hover {
    background: linear-gradient(90deg, #ffb347 0%, #ff6b35 100%);
    color: #fff;
    transform: translateY(-2px) scale(1.04);
    text-decoration: none;
  }
`;

const Dots = styled.div`
  position: absolute;
  bottom: 1.5rem;
  right: 2.5rem;
  display: flex;
  gap: 0.5rem;
  z-index: 3;
  @media (max-width: 900px) {
    position: static;
    justify-content: center;
    margin-top: 1.5rem;
    right: auto;
    bottom: auto;
  }
`;

const Dot = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: ${({active}) =>
    active ? 'var(--wnba-orange, #ff6b35)' : '#444'};
  opacity: ${({active}) => (active ? 1 : 0.5)};
  transition:
    background 0.2s,
    opacity 0.2s;
  cursor: pointer;
`;

const NavArrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(30, 30, 30, 0.7);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  z-index: 4;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.2s;
  &:hover {
    background: #ff6b35;
    color: #fff;
    transform: translateY(-50%) scale(1.08);
  }
`;

const NavArrowLeft = styled(NavArrow)`
  left: 1.2rem;
`;
const NavArrowRight = styled(NavArrow)`
  right: 1.2rem;
`;

const ProductCarousel = () => {
  const [featuredJerseys, setFeaturedJerseys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const dispatch = useDispatch();
  const {favorites} = useSelector((state) => state.favorites);

  useEffect(() => {
    const fetchFeaturedJerseys = async () => {
      try {
        const {data} = await axios.get('/api/products/featured?limit=5');
        setFeaturedJerseys(data);
      } catch (error) {
        console.error('Error fetching featured jerseys:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedJerseys();
  }, []);

  const addToCartHandler = (jersey) => {
    dispatch(addToCart({...jersey, qty: 1}));
  };

  const toggleFavoriteHandler = (jersey) => {
    const isFavorite = favorites.find((x) => x._id === jersey._id);
    if (isFavorite) {
      dispatch(removeFromFavorites(jersey._id));
    } else {
      dispatch(addToFavorites(jersey));
    }
  };

  if (loading || featuredJerseys.length === 0) {
    return null;
  }

  const jersey = featuredJerseys[current];

  return (
    <BannerContainer>
      {current > 0 && (
        <NavArrowLeft
          onClick={() => setCurrent(current - 1)}
          aria-label='Previous'
        >
          <FaChevronLeft />
        </NavArrowLeft>
      )}
      <BannerLeft>
        <Meta>
          <span>
            <FaBasketballBall style={{marginRight: 6}} /> {jersey.team}
          </span>
          <span>
            <FaStar style={{marginRight: 4, color: '#ffb347'}} />{' '}
            {jersey.rating}
          </span>
          <span>
            <FaFire style={{marginRight: 4, color: '#ff6b35'}} />{' '}
            {jersey.totalSold || 0} sold
          </span>
        </Meta>
        <Title>{jersey.name}</Title>
        <Description>{jersey.description}</Description>
        <ShopButton to={`/product/${jersey._id}`}>
          Shop Now <FaArrowRight />
        </ShopButton>
      </BannerLeft>
      <BannerRight>
        <JerseyImage
          src={jersey.image}
          alt={jersey.name}
        />
      </BannerRight>
      {current < featuredJerseys.length - 1 && (
        <NavArrowRight
          onClick={() => setCurrent(current + 1)}
          aria-label='Next'
        >
          <FaChevronRight />
        </NavArrowRight>
      )}
      <Dots>
        {featuredJerseys.map((_, idx) => (
          <Dot
            key={idx}
            active={idx === current}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </Dots>
    </BannerContainer>
  );
};

export default ProductCarousel;
