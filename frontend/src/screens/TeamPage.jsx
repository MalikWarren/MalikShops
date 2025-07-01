import {useState, useEffect} from 'react';
import {useParams, Link} from 'react-router-dom';
import {Row, Col, Card, Button, Badge} from 'react-bootstrap';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {addToCart} from '../slices/cartSlice';
import Message from '../components/Message';
import Loader from '../components/Loader';
import styled from 'styled-components';
import {TEAM_COLORS} from '../utils/teamLogoUrls';
import ProductCard from '../components/ProductCard';
import players from '../data/players';
import {
  FaBasketballBall,
  FaTrophy,
  FaUsers,
  FaShoppingCart,
  FaStar,
  FaArrowLeft,
} from 'react-icons/fa';

function getContrastYIQ(hexcolor) {
  hexcolor = hexcolor.replace('#', '');
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq > 180; // true = dark text, false = white text
}

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`;

const TeamHeader = styled.div`
  background: ${({$bgcolor}) =>
    `linear-gradient(135deg, ${$bgcolor} 0%, ${$bgcolor}dd 100%)`};
  padding: 4rem 0 3rem 0;
  margin-bottom: 0;
  text-align: center;
  position: relative;
  overflow: hidden;
  color: ${({$darktext}) => ($darktext ? 'var(--gray-900)' : 'white')};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
  }
`;

const BackButton = styled(Link)`
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    color: inherit;
    text-decoration: none;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const TeamLogo = styled.img`
  width: 140px;
  height: 140px;
  object-fit: contain;
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  padding: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 4px solid rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 5;
`;

const TeamTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  color: inherit;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 5;
`;

const TeamSubtitle = styled.p`
  color: ${({$darktext}) =>
    $darktext ? 'var(--gray-700)' : 'rgba(255,255,255,0.9)'};
  font-size: 1.25rem;
  margin-bottom: 1rem;
  font-weight: 500;
  position: relative;
  z-index: 5;
`;

const TeamStat = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${({$darktext}) => ($darktext ? 'var(--gray-800)' : 'white')};
  position: relative;
  z-index: 5;
`;

const ContentSection = styled.div`
  padding: 3rem 0;
  background: white;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const StatsSection = styled.div`
  background: white;
  border-radius: 1.5rem;
  padding: 2.5rem;
  margin: -2rem auto 3rem auto;
  max-width: 1000px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 10;
`;

const StatsTitle = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 2rem;
  text-align: center;
  color: var(--gray-900);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 1rem;
  padding: 2rem 1.5rem;
  text-align: center;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--wnba-orange), #f59e0b);
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
    border-color: var(--wnba-orange);
  }
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  color: var(--gray-900);
  background: linear-gradient(135deg, var(--wnba-orange), #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--gray-600);
`;

const PositionBadge = styled(Badge)`
  font-size: 0.8rem;
  padding: 0.6rem 1rem;
  margin: 0.25rem;
  border-radius: 1.5rem;
  background: ${({$bgcolor}) => $bgcolor || '#6c757d'} !important;
  color: white !important;
  border: none;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const PlayersSection = styled.div`
  background: white;
  border-radius: 1.5rem;
  padding: 2.5rem;
  margin: 2rem auto;
  max-width: 1200px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
`;

const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  color: var(--gray-600);
  margin-bottom: 0;
  font-weight: 500;
`;

const HorizontalRow = styled.div`
  display: grid !important;
  grid-template-columns: repeat(5, 1fr) !important;
  gap: 1.5rem;
  margin: 1rem 0;
  padding: 0.5rem 0;

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

const TeamPage = () => {
  const {teamName} = useParams();
  const [jerseys, setJerseys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  console.log('TeamPage rendered with teamName:', teamName);

  useEffect(() => {
    const fetchTeamJerseys = async () => {
      try {
        setLoading(true);

        // First try to get data from API
        try {
          const {data} = await axios.get(`/api/products/team/${teamName}`);
          if (data && data.length > 0) {
            setJerseys(data);
            setError(null);
            return;
          }
        } catch (apiErr) {
          console.log(
            'API call failed, falling back to local data:',
            apiErr.message
          );
        }

        // Fallback to local data
        const displayTeamName = teamName
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        const localJerseys = players.filter(
          (player) =>
            player.team.toLowerCase() === displayTeamName.toLowerCase()
        );

        if (localJerseys.length > 0) {
          // Transform local data to match API format
          const transformedJerseys = localJerseys.map((player) => ({
            _id: player.id,
            name: player.name,
            team: player.team,
            jerseyNumber: player.jerseyNumber,
            image: player.image,
            position: player.position,
            price: player.price,
            countInStock: player.countInStock,
            rating: player.rating,
            numReviews: player.numReviews,
            description: player.description,
            stats: player.stats,
          }));

          setJerseys(transformedJerseys);
          setError(null);
        } else {
          setError('No jerseys found for this team');
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Error loading team jerseys. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTeamJerseys();
  }, [teamName]);

  const addToCartHandler = (jersey) => {
    dispatch(addToCart({...jersey, qty: 1}));
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant='danger'>{error}</Message>;
  }

  const displayTeamName = teamName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const colorObj = TEAM_COLORS[displayTeamName] || {
    primary: '#222',
    secondary: '#eee',
  };
  const useDarkText = getContrastYIQ(colorObj.primary);

  // Calculate team statistics
  const totalPlayers = jerseys.length;
  const averagePrice =
    totalPlayers > 0
      ? (
          jerseys.reduce((sum, jersey) => sum + jersey.price, 0) / totalPlayers
        ).toFixed(2)
      : 0;
  const inStockCount = jerseys.filter(
    (jersey) => jersey.countInStock > 0
  ).length;
  const outOfStockCount = totalPlayers - inStockCount;

  // Position breakdown
  const positions = {};
  jerseys.forEach((jersey) => {
    const position = jersey.name.includes('Guard')
      ? 'Guard'
      : jersey.name.includes('Forward')
        ? 'Forward'
        : jersey.name.includes('Center')
          ? 'Center'
          : 'Player';
    positions[position] = (positions[position] || 0) + 1;
  });

  const positionColors = {
    Guard: '#007bff',
    Forward: '#28a745',
    Center: '#dc3545',
    Player: '#6c757d',
  };

  return (
    <PageContainer>
      <TeamHeader
        $bgcolor={colorObj.primary}
        $darktext={useDarkText}
      >
        <BackButton to='/teams'>
          <FaArrowLeft /> Back to Teams
        </BackButton>
        <TeamLogo
          src={`/images/teams/${teamName}.png`}
          alt={`${displayTeamName} logo`}
          onError={(e) => {
            e.target.src = '/images/teams/default-team.png';
          }}
        />
        <TeamTitle>{displayTeamName}</TeamTitle>
        <TeamSubtitle $darktext={useDarkText}>
          Official WNBA Jerseys Collection
        </TeamSubtitle>
        <TeamStat $darktext={useDarkText}>
          {jerseys.length} Player{jerseys.length === 1 ? '' : 's'} Available
        </TeamStat>
      </TeamHeader>

      <ContentSection>
        <Container>
          {/* Team Statistics Section */}
          <StatsSection>
            <StatsTitle>
              <FaTrophy /> Team Statistics
            </StatsTitle>

            <Row className='g-4 mb-4'>
              <Col
                xs={6}
                md={3}
              >
                <StatCard>
                  <StatNumber>{totalPlayers}</StatNumber>
                  <StatLabel>Total Players</StatLabel>
                </StatCard>
              </Col>
              <Col
                xs={6}
                md={3}
              >
                <StatCard>
                  <StatNumber>${averagePrice}</StatNumber>
                  <StatLabel>Average Price</StatLabel>
                </StatCard>
              </Col>
              <Col
                xs={6}
                md={3}
              >
                <StatCard>
                  <StatNumber>{inStockCount}</StatNumber>
                  <StatLabel>In Stock</StatLabel>
                </StatCard>
              </Col>
              <Col
                xs={6}
                md={3}
              >
                <StatCard>
                  <StatNumber>{outOfStockCount}</StatNumber>
                  <StatLabel>Out of Stock</StatLabel>
                </StatCard>
              </Col>
            </Row>

            {/* Position Breakdown */}
            <div className='text-center'>
              <h4
                style={{
                  marginBottom: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--gray-800)',
                }}
              >
                <FaUsers style={{marginRight: '0.5rem'}} />
                Position Breakdown
              </h4>
              <div>
                {Object.entries(positions).map(([position, count]) => (
                  <PositionBadge
                    key={position}
                    $bgcolor={positionColors[position]}
                  >
                    {position}: {count}
                  </PositionBadge>
                ))}
              </div>
            </div>
          </StatsSection>

          {/* Players Section */}
          <PlayersSection>
            <SectionHeader>
              <SectionTitle>
                <FaBasketballBall /> Player Jerseys
              </SectionTitle>
              <SectionSubtitle>
                Browse and shop official {displayTeamName} player jerseys
              </SectionSubtitle>
            </SectionHeader>

            <HorizontalRow>
              {jerseys.map((jersey) => (
                <ProductCard
                  key={jersey._id}
                  product={jersey}
                />
              ))}
            </HorizontalRow>
          </PlayersSection>
        </Container>
      </ContentSection>
    </PageContainer>
  );
};

export default TeamPage;
