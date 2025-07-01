import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Row, Col} from 'react-bootstrap';
import styled from 'styled-components';
import axios from 'axios';
import Meta from '../components/Meta';
import {TEAM_COLORS} from '../utils/teamLogoUrls';
import players from '../data/players';

const Container = styled.div`
  min-height: 100vh;
  padding: 3rem 0 2rem 0;
  margin-top: 1rem;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: var(--gray-900);
`;

const PageSubtitle = styled.p`
  font-size: 1.1rem;
  color: var(--gray-600);
  margin-bottom: 0;
`;

const TeamsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const TeamCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: ${({$bgcolor}) => $bgcolor || '#f4f4f4'};
  border-radius: 1rem;
  border: 3px solid #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  text-decoration: none;
  color: ${({$darktext}) => ($darktext ? 'var(--gray-900)' : 'white')};
  transition: all 0.3s cubic-bezier(0.4, 2, 0.3, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: scale(1.04) translateY(-4px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    z-index: 2;
    text-decoration: none;
  }
`;

const TeamLogo = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  padding: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const TeamName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: center;
  letter-spacing: 1px;
  color: inherit;
`;

const TeamLocation = styled.p`
  color: ${({$darktext}) =>
    $darktext ? 'var(--gray-200)' : 'rgba(255,255,255,0.85)'};
  font-size: 0.95rem;
  margin-bottom: 0;
  text-align: center;
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

function getContrastYIQ(hexcolor) {
  // Returns true if dark text should be used on this background
  hexcolor = hexcolor.replace('#', '');
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq > 180; // true = dark text, false = white text
}

const TeamsScreen = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Immediately scroll to top when component mounts
    window.scrollTo(0, 0);

    const fetchTeams = async () => {
      try {
        // First try to get teams from API
        try {
          const {data} = await axios.get('/api/products/teams');
          if (data && data.length > 0) {
            setTeams(data);
            return;
          }
        } catch (apiErr) {
          console.log(
            'API call failed, falling back to local data:',
            apiErr.message
          );
        }

        // Fallback to local data
        const localTeams = [...new Set(players.map((player) => player.team))];
        setTeams(localTeams);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return (
      <LoadingSpinner>
        <div className='spinner'></div>
      </LoadingSpinner>
    );
  }

  if (error) {
    return <ErrorMessage>Error loading teams: {error}</ErrorMessage>;
  }

  return (
    <Container>
      <Meta
        title='WNBA Teams | WNBA Jersey Store'
        description='Browse all WNBA teams and find jerseys for your favorite players.'
        keywords='WNBA teams, basketball teams, WNBA store'
      />

      <PageHeader>
        <PageTitle>WNBA Teams</PageTitle>
        <PageSubtitle>
          Explore all 13 WNBA teams and find jerseys for your favorite players
        </PageSubtitle>
      </PageHeader>

      <TeamsGrid className='stagger-content'>
        {teams.map((team) => {
          const colorObj = TEAM_COLORS[team] || {
            primary: '#222',
            secondary: '#eee',
          };
          const useDarkText = getContrastYIQ(colorObj.primary);
          return (
            <TeamCard
              key={team}
              to={`/team/${team.toLowerCase().replace(/\s+/g, '-')}`}
              $bgcolor={colorObj.primary}
              $darktext={useDarkText}
            >
              <TeamLogo
                src={`/images/teams/${team.toLowerCase().replace(/\s+/g, '-')}.png`}
                alt={`${team} logo`}
                onError={(e) => {
                  e.target.src = '/images/teams/default-team.png';
                }}
              />
              <TeamName>{team}</TeamName>
              <TeamLocation $darktext={useDarkText}>WNBA Team</TeamLocation>
            </TeamCard>
          );
        })}
      </TeamsGrid>
    </Container>
  );
};

export default TeamsScreen;
