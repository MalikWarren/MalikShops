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

function getContrastYIQ(hexcolor) {
  hexcolor = hexcolor.replace('#', '');
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq > 180; // true = dark text, false = white text
}

const TeamHeader = styled.div`
  background: ${({$bgcolor}) => $bgcolor || '#222'};
  padding: 2.5rem 0 2rem 0;
  margin-bottom: 2.5rem;
  text-align: center;
  border-bottom: 4px solid #fff;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  color: ${({$darktext}) => ($darktext ? 'var(--gray-900)' : 'white')};
`;

const TeamLogo = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  padding: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const TeamTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: inherit;
`;

const TeamSubtitle = styled.p`
  color: ${({$darktext}) =>
    $darktext ? 'var(--gray-200)' : 'rgba(255,255,255,0.85)'};
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const TeamStat = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({$darktext}) => ($darktext ? 'var(--gray-700)' : 'white')};
`;

const StatsSection = styled.div`
  background: ${({$bgcolor}) => $bgcolor || '#f8f9fa'};
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2.5rem;
  border: 3px solid #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  color: ${({$darktext}) => ($darktext ? 'var(--gray-900)' : 'white')};
`;

const StatsTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
  color: inherit;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 1.5rem;
  text-align: center;
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: inherit;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.8;
  color: inherit;
`;

const PositionBadge = styled(Badge)`
  font-size: 0.8rem;
  padding: 0.5rem 0.75rem;
  margin: 0.25rem;
  border-radius: 1rem;
  background: ${({$bgcolor}) => $bgcolor || '#6c757d'} !important;
  color: white !important;
  border: none;
`;

const JerseyCard = styled(Card)`
  height: 100%;
  border-radius: 1rem;
  border: 3px solid #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  background: ${({$bgcolor}) => $bgcolor || '#f4f4f4'};
  color: ${({$darktext}) => ($darktext ? 'var(--gray-900)' : 'white')};
  transition: all 0.3s cubic-bezier(0.4, 2, 0.3, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

  &:hover {
    transform: scale(1.04) translateY(-4px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    z-index: 2;
  }
`;

const JerseyImage = styled(Card.Img)`
  height: 260px;
  object-fit: contain;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 1rem;
  margin-top: 1rem;
`;

const JerseyTitle = styled(Card.Title)`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: inherit;
`;

const JerseyPrice = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({$darktext}) => ($darktext ? '#0d6efd' : '#fff')};
  margin-bottom: 1rem;
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
    <>
      <TeamHeader
        $bgcolor={colorObj.primary}
        $darktext={useDarkText}
      >
        <TeamLogo
          src={`/images/teams/${teamName}.png`}
          alt={`${displayTeamName} logo`}
          onError={(e) => {
            e.target.src = '/images/teams/default-team.png';
          }}
        />
        <TeamTitle>{displayTeamName}</TeamTitle>
        <TeamSubtitle $darktext={useDarkText}>
          Official WNBA Jerseys
        </TeamSubtitle>
        <TeamStat $darktext={useDarkText}>
          {jerseys.length} Player{jerseys.length === 1 ? '' : 's'}
        </TeamStat>
      </TeamHeader>

      {/* Team Statistics Section */}
      <StatsSection
        $bgcolor={colorObj.primary}
        $darktext={useDarkText}
      >
        <StatsTitle>Team Statistics</StatsTitle>

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
          <h4 style={{marginBottom: '1rem', fontWeight: 600}}>
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

      <div className='headshot-grid'>
        {jerseys.map((jersey) => (
          <ProductCard
            key={jersey._id}
            product={jersey}
          />
        ))}
      </div>
    </>
  );
};

export default TeamPage;
