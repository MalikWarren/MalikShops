import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {FaBasketballBall, FaStar, FaArrowRight} from 'react-icons/fa';

const HeroContainer = styled.div`
  background: var(--gradient-hero);
  color: var(--white);
  padding: 4rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;
  border-bottom: none;
  box-shadow: none;
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const HeroTitle = styled.h1`
  color: var(--wnba-orange);
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  letter-spacing: 2px;
  text-shadow: 0 2px 8px rgba(30, 58, 138, 0.1);
`;

const HeroSubtitle = styled.p`
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  margin-bottom: 2.5rem;
  opacity: 0.9;
  line-height: 1.6;
  animation: fadeInUp 1s ease-out 0.2s both;
`;

const HeroStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  animation: fadeInUp 1s ease-out 0.4s both;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: var(--wnba-yellow);
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeInUp 1s ease-out 0.6s both;
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: var(--white);
  color: var(--wnba-orange);
  text-decoration: none;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-lg);

  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-xl);
    color: var(--wnba-orange);
    text-decoration: none;
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: transparent;
  color: var(--white);
  text-decoration: none;
  border: 2px solid var(--white);
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;

  &:hover {
    background: var(--white);
    color: var(--wnba-orange);
    transform: translateY(-3px);
    text-decoration: none;
  }
`;

const FloatingIcon = styled.div`
  position: absolute;
  font-size: 2rem;
  color: var(--wnba-yellow);
  opacity: 0.6;
  animation: float 6s ease-in-out infinite;

  &:nth-child(1) {
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }

  &:nth-child(2) {
    top: 60%;
    right: 15%;
    animation-delay: 2s;
  }

  &:nth-child(3) {
    bottom: 30%;
    left: 20%;
    animation-delay: 4s;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(180deg);
    }
  }
`;

const HeroSection = () => {
  return (
    <HeroContainer>
      <HeroBackground />

      <FloatingIcon>
        <FaBasketballBall />
      </FloatingIcon>
      <FloatingIcon>
        <FaStar />
      </FloatingIcon>
      <FloatingIcon>
        <FaBasketballBall />
      </FloatingIcon>

      <HeroContent>
        <HeroTitle>WNBA Jersey Store</HeroTitle>
        <HeroSubtitle>
          Represent your favorite WNBA players with authentic, high-quality
          jerseys. From Breanna Stewart to A'ja Wilson, show your support for
          the best in women's basketball.
        </HeroSubtitle>

        <HeroStats>
          <StatItem>
            <StatNumber>13</StatNumber>
            <StatLabel>Teams</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>158</StatNumber>
            <StatLabel>Players</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>⭐</StatNumber>
            <StatLabel>Premium Quality</StatLabel>
          </StatItem>
        </HeroStats>

        <HeroButtons>
          <PrimaryButton to='/products'>
            Shop Jerseys <FaArrowRight />
          </PrimaryButton>
          <SecondaryButton to='/teams'>
            View Teams <FaBasketballBall />
          </SecondaryButton>
        </HeroButtons>
      </HeroContent>
    </HeroContainer>
  );
};

export default HeroSection;
