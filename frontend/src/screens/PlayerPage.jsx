import React, {useState, useEffect} from 'react';
import {useParams, Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import players, {generateRealisticStats} from '../data/players';
import {Row, Col, Card, Button} from 'react-bootstrap';
import styled from 'styled-components';
import {
  FaBasketballBall,
  FaShoppingCart,
  FaArrowLeft,
  FaFire,
  FaTrophy,
} from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import Meta from '../components/Meta';
import {addToCart} from '../slices/cartSlice';
import {
  useGetProductDetailsQuery,
  useGetProductsQuery,
} from '../slices/productsApiSlice';

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const PlayerHeader = styled.div`
  background: var(--gradient-primary);
  padding: 3rem 0;
  margin-bottom: 3rem;
  color: white;
  text-align: center;
  border-radius: 0 0 2rem 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const PlayerImage = styled.img`
  width: 200px;
  height: 250px;
  object-fit: cover;
  border-radius: 1rem;
  border: 4px solid white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  margin-bottom: 1.5rem;
`;

const PlayerName = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
`;

const PlayerTeam = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  opacity: 0.9;
`;

const PlayerNumber = styled.div`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 2rem;
  font-size: 1.2rem;
  font-weight: 700;
  display: inline-block;
  margin-bottom: 1rem;
`;

const BackButton = styled(Link)`
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    color: white;
    text-decoration: none;
    transform: translateY(-2px);
  }
`;

const StatsSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const SectionTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--gray-900);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: var(--gray-50);
  padding: 1.5rem;
  border-radius: 0.75rem;
  text-align: center;
  border: 2px solid var(--gray-100);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-color: var(--wnba-orange);
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: var(--wnba-orange);
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: var(--gray-600);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const BioSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const BioText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--gray-700);
  margin-bottom: 1rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--gray-50);
  border-radius: 0.5rem;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: var(--gray-700);
  min-width: 100px;
`;

const InfoValue = styled.span`
  color: var(--gray-900);
  font-weight: 500;
`;

const RelatedProductsSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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

// Check if the ID is a valid MongoDB ObjectId (24 character hex string)
const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

const PlayerPage = () => {
  const {playerId} = useParams();
  const dispatch = useDispatch();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Add to cart handler
  const addToCartHandler = () => {
    if (player) {
      const cartItem = {
        ...player,
        _id: player._id || player.id, // Ensure _id for cart compatibility
        qty: 1,
      };
      dispatch(addToCart(cartItem));
    }
  };

  // Try to fetch product from database only if it's a valid ObjectId
  const {
    data: productData,
    isLoading: productLoading,
    error: productError,
  } = useGetProductDetailsQuery(playerId, {
    skip: !playerId || !isValidObjectId(playerId), // Skip if it's not a valid ObjectId
  });

  // Fetch related products if we have a team
  const {data: relatedData, isLoading: relatedLoading} = useGetProductsQuery(
    {keyword: player?.team},
    {skip: !player?.team || player?.team === 'Unknown Team'}
  );

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setLoading(true);

        console.log('PlayerPage: Fetching player data for ID:', playerId);
        console.log(
          'PlayerPage: Is valid ObjectId:',
          isValidObjectId(playerId)
        );

        // First, try to find player in local data
        let foundPlayer = players.find(
          (p) =>
            p.id === playerId ||
            p.name.replace(/\s+/g, '-').toLowerCase() === playerId
        );

        console.log('PlayerPage: Found in local data:', foundPlayer);

        if (foundPlayer) {
          // If found in local data, get related products from local data
          const related = players.filter(
            (p) => p.team === foundPlayer.team && p.id !== foundPlayer.id
          );

          // Ensure local player has stats
          const playerWithStats = {
            ...foundPlayer,
            stats:
              foundPlayer.stats ||
              generateRealisticStats(foundPlayer.name, foundPlayer.team).stats,
          };

          setPlayer(playerWithStats);
          setRelatedProducts(related);
          console.log(
            'PlayerPage: Using local player data with stats:',
            playerWithStats.stats
          );
        } else if (isValidObjectId(playerId) && productData) {
          // If it's a valid ObjectId and we have product data, transform the data
          console.log('PlayerPage: Using database product data:', productData);

          // Generate realistic stats for database players
          const {stats, position} = generateRealisticStats(
            productData.player || productData.name,
            productData.team
          );

          const transformedPlayer = {
            id: productData._id,
            name: productData.player || productData.name,
            team: productData.team,
            jerseyNumber: productData.jerseyNumber,
            image: productData.image,
            position: position,
            price: productData.price,
            countInStock: productData.countInStock,
            rating: productData.rating,
            numReviews: productData.numReviews,
            description: productData.description,
            stats: stats, // Add the generated stats
          };

          setPlayer(transformedPlayer);

          // Related products will be handled by the useGetProductsQuery hook
        } else if (isValidObjectId(playerId) && productError) {
          console.log('PlayerPage: Database error:', productError);
          setError('Player not found');
        } else if (!isValidObjectId(playerId)) {
          // If it's not a valid ObjectId and not found in local data
          console.log(
            'PlayerPage: Not a valid ObjectId and not found in local data'
          );
          setError('Player not found');
        }
      } catch (err) {
        console.log('PlayerPage: Error:', err);
        setError('Player not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [playerId, productData, productError, isValidObjectId]);

  // Update related products when we get data from the API
  useEffect(() => {
    if (
      relatedData &&
      relatedData.products &&
      player &&
      isValidObjectId(player.id)
    ) {
      const transformedRelated = relatedData.products
        .filter((p) => p._id !== player.id)
        .map((product) => ({
          id: product._id,
          name: product.player || product.name,
          team: product.team,
          jerseyNumber: product.jerseyNumber,
          image: product.image,
          position: 'Player',
          price: product.price,
          countInStock: product.countInStock,
          rating: product.rating,
          numReviews: product.numReviews,
          description: product.description,
        }));

      setRelatedProducts(transformedRelated);
    }
  }, [relatedData, player, isValidObjectId]);

  // Helper to get stat or N/A
  const getStat = (stat) => {
    const value =
      player && player.stats && stat in player.stats
        ? player.stats[stat]
        : 'N/A';
    console.log(`Getting stat ${stat}:`, value, 'Player stats:', player?.stats);
    return value;
  };

  if (loading || (isValidObjectId(playerId) && productLoading)) {
    return (
      <Container>
        <div style={{textAlign: 'center', padding: '4rem'}}>
          <h2>Loading player...</h2>
        </div>
      </Container>
    );
  }

  if (error || (!player && (isValidObjectId(playerId) ? productError : true))) {
    return (
      <Container>
        <div style={{textAlign: 'center', padding: '4rem'}}>
          <h2>Player not found</h2>
          <Link
            to='/products'
            className='btn btn-primary'
          >
            Back to Products
          </Link>
        </div>
      </Container>
    );
  }

  // Additional null check to prevent runtime errors
  if (!player) {
    return (
      <Container>
        <div style={{textAlign: 'center', padding: '4rem'}}>
          <h2>Loading player data...</h2>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Meta
        title={`${player?.name || 'Player'} - ${player?.team || 'Team'} | WNBA Jersey Store`}
        description={`Learn more about ${player?.name || 'this player'}, ${player?.team || 'their team'} player. View stats, bio, and shop official jerseys.`}
        keywords={`${player?.name || 'player'}, ${player?.team || 'team'}, WNBA, basketball, jersey`}
      />
      <PlayerHeader>
        <BackButton to='/products'>
          <FaArrowLeft /> Back to Products
        </BackButton>
        <PlayerImage
          src={player?.image || '/images/sample.jpg'}
          alt={player?.name || 'Player'}
          onError={(e) => {
            e.target.src = '/images/sample.jpg';
          }}
        />
        <PlayerName>{player?.name || 'Unknown Player'}</PlayerName>
        <PlayerTeam>{player?.team || 'Unknown Team'}</PlayerTeam>
        {player?.jerseyNumber && (
          <PlayerNumber>#{player.jerseyNumber}</PlayerNumber>
        )}
        <div style={{marginTop: '1rem'}}>
          <Button
            variant='light'
            size='lg'
            style={{marginRight: '1rem'}}
            onClick={addToCartHandler}
            disabled={(player?.countInStock || 0) === 0}
          >
            <FaShoppingCart /> Add to Cart - ${player?.price || '0'}
          </Button>
        </div>
      </PlayerHeader>
      <Row>
        <Col lg={8}>
          <StatsSection>
            <SectionTitle>
              <FaBasketballBall /> Season Statistics
            </SectionTitle>
            <StatsGrid>
              <StatCard>
                <StatValue>{getStat('points')}</StatValue>
                <StatLabel>Points Per Game</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{getStat('rebounds')}</StatValue>
                <StatLabel>Rebounds Per Game</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{getStat('assists')}</StatValue>
                <StatLabel>Assists Per Game</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{getStat('steals')}</StatValue>
                <StatLabel>Steals Per Game</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{getStat('blocks')}</StatValue>
                <StatLabel>Blocks Per Game</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{getStat('fgPct')}%</StatValue>
                <StatLabel>Field Goal %</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{getStat('threePtPct')}%</StatValue>
                <StatLabel>3-Point %</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{getStat('ftPct')}%</StatValue>
                <StatLabel>Free Throw %</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{getStat('games')}</StatValue>
                <StatLabel>Games Played</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{getStat('minutes')}</StatValue>
                <StatLabel>Minutes Per Game</StatLabel>
              </StatCard>
            </StatsGrid>
          </StatsSection>
        </Col>
        <Col lg={4}>
          <Card style={{marginBottom: '2rem'}}>
            <Card.Body>
              <Card.Title style={{fontSize: '1.5rem', fontWeight: 700}}>
                {player?.name || 'Unknown Player'}
              </Card.Title>
              <Card.Text
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'var(--wnba-orange)',
                }}
              >
                ${player?.price || '0'}
              </Card.Text>
              <Card.Text>
                <strong>Team:</strong> {player?.team || 'Unknown Team'}
              </Card.Text>
              <Card.Text>
                <strong>Rating:</strong> ⭐ {player?.rating || '0'} (
                {player?.numReviews || '0'} reviews)
              </Card.Text>
              <Card.Text>
                <strong>Stock:</strong>{' '}
                {(player?.countInStock || 0) > 0
                  ? `${player.countInStock} available`
                  : 'Out of stock'}
              </Card.Text>
              <Button
                variant='primary'
                size='lg'
                disabled={(player?.countInStock || 0) === 0}
                style={{width: '100%', marginTop: '1rem'}}
                onClick={addToCartHandler}
              >
                <FaShoppingCart /> Add to Cart
              </Button>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Card.Title style={{fontSize: '1.2rem', fontWeight: 700}}>
                <FaFire /> Quick Stats
              </Card.Title>
              <div style={{marginTop: '1rem'}}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                  }}
                >
                  <span>PPG:</span>
                  <strong>{getStat('points')}</strong>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                  }}
                >
                  <span>RPG:</span>
                  <strong>{getStat('rebounds')}</strong>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                  }}
                >
                  <span>APG:</span>
                  <strong>{getStat('assists')}</strong>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span>Games:</span>
                  <strong>{getStat('games')}</strong>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {relatedProducts.length > 0 && (
        <RelatedProductsSection>
          <SectionTitle>
            <FaTrophy /> More {player?.team || 'Team'} Jerseys
          </SectionTitle>
          <p style={{color: 'var(--gray-600)', marginBottom: '1rem'}}>
            Check out other players from the {player?.team || 'team'}
          </p>
          <ProductsGrid>
            {relatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </ProductsGrid>
        </RelatedProductsSection>
      )}
    </Container>
  );
};

export default PlayerPage;
