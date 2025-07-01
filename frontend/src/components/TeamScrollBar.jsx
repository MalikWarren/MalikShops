import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Row, Col} from 'react-bootstrap';
import axios from 'axios';
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa';
import styled from 'styled-components';

const ScrollContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  background: #f8f9fa;
  padding: 10px 0;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ScrollContent = styled.div`
  display: flex;
  transition: transform 0.3s ease;
  padding: 0 40px;
`;

const TeamItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #333;
  padding: 10px 20px;
  min-width: 120px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    color: #0d6efd;
  }
`;

const TeamLogo = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin-bottom: 8px;
`;

const TeamName = styled.span`
  font-size: 0.9rem;
  text-align: center;
  font-weight: 500;
`;

const ScrollButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: white;
  }

  &.left {
    left: 5px;
  }

  &.right {
    right: 5px;
  }
`;

const TeamScrollBar = () => {
  const [teams, setTeams] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const {data} = await axios.get('/api/products/teams');
        setTeams(data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    const updateWidths = () => {
      const container = document.querySelector('.scroll-container');
      const content = document.querySelector('.scroll-content');
      if (container && content) {
        setContainerWidth(container.offsetWidth);
        setContentWidth(content.scrollWidth);
      }
    };

    updateWidths();
    window.addEventListener('resize', updateWidths);
    return () => window.removeEventListener('resize', updateWidths);
  }, [teams]);

  const scroll = (direction) => {
    const scrollAmount = containerWidth * 0.8;
    const newPosition =
      direction === 'left'
        ? Math.max(scrollPosition - scrollAmount, 0)
        : Math.min(
            scrollPosition + scrollAmount,
            contentWidth - containerWidth
          );

    setScrollPosition(newPosition);
  };

  return (
    <ScrollContainer className='scroll-container'>
      <ScrollButton
        className='left'
        onClick={() => scroll('left')}
        style={{display: scrollPosition > 0 ? 'flex' : 'none'}}
      >
        <FaChevronLeft />
      </ScrollButton>

      <ScrollContent
        className='scroll-content'
        style={{transform: `translateX(-${scrollPosition}px)`}}
      >
        {teams.map((team) => (
          <TeamItem
            key={team}
            to={`/team/${team.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <TeamLogo
              src={`/images/teams/${team.toLowerCase().replace(/\s+/g, '-')}.png`}
              alt={`${team} logo`}
              onError={(e) => {
                e.target.src = '/images/teams/default-team.png';
              }}
            />
            <TeamName>{team}</TeamName>
          </TeamItem>
        ))}
      </ScrollContent>

      <ScrollButton
        className='right'
        onClick={() => scroll('right')}
        style={{
          display:
            scrollPosition < contentWidth - containerWidth ? 'flex' : 'none',
        }}
      >
        <FaChevronRight />
      </ScrollButton>
    </ScrollContainer>
  );
};

export default TeamScrollBar;
