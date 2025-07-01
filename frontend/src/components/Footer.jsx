import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {
  FaBasketballBall,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaHeart,
} from 'react-icons/fa';

const FooterContainer = styled.footer`
  background: var(--gray-900);
  color: var(--white);
  padding: 4rem 0 2rem;
  margin-top: 4rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
`;

const FooterSection = styled.div`
  h3 {
    color: var(--wnba-orange);
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -0.5rem;
      left: 0;
      width: 30px;
      height: 2px;
      background: var(--wnba-orange);
    }
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 0.75rem;
  }

  a {
    color: var(--gray-300);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--wnba-orange);
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--gray-800);
  color: var(--gray-300);
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: var(--wnba-orange);
    color: var(--white);
    transform: translateY(-2px);
  }
`;

const NewsletterSection = styled.div`
  background: var(--gray-800);
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  background: var(--gray-700);
  color: var(--white);
  font-size: 1rem;

  &::placeholder {
    color: var(--gray-400);
  }

  &:focus {
    outline: 2px solid var(--wnba-orange);
  }
`;

const NewsletterButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: var(--gradient-primary);
  color: var(--white);
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid var(--gray-800);
  padding-top: 2rem;
  text-align: center;
  color: var(--gray-400);
  font-size: 0.875rem;
`;

const BrandSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;

  .brand-logo {
    font-size: 1.5rem;
    color: var(--wnba-orange);
  }

  .brand-text {
    font-size: 1.5rem;
    font-weight: 800;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Footer = () => {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Add newsletter subscription logic here
    alert('Thank you for subscribing to our newsletter!');
  };

  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <BrandSection>
              <FaBasketballBall className='brand-logo' />
              <span className='brand-text'>WNBA Store</span>
            </BrandSection>
            <p style={{color: 'var(--gray-300)', lineHeight: '1.6'}}>
              Your premier destination for authentic WNBA jerseys. Support your
              favorite players and teams with high-quality merchandise.
            </p>
            <SocialLinks>
              <SocialButton
                href='#'
                aria-label='Twitter'
              >
                <FaTwitter />
              </SocialButton>
              <SocialButton
                href='#'
                aria-label='Facebook'
              >
                <FaFacebook />
              </SocialButton>
              <SocialButton
                href='#'
                aria-label='Instagram'
              >
                <FaInstagram />
              </SocialButton>
              <SocialButton
                href='#'
                aria-label='YouTube'
              >
                <FaYoutube />
              </SocialButton>
            </SocialLinks>
          </FooterSection>

          <FooterSection>
            <h3>Shop</h3>
            <FooterLinks>
              <li>
                <Link to='/products'>All Jerseys</Link>
              </li>
              <li>
                <Link to='/products?featured=true'>Featured</Link>
              </li>
              <li>
                <Link to='/products/top-selling'>Top Selling</Link>
              </li>
              <li>
                <Link to='/teams'>By Team</Link>
              </li>
              <li>
                <Link to='/cart'>Shopping Cart</Link>
              </li>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <h3>Teams</h3>
            <FooterLinks>
              <li>
                <Link to='/team/atlanta-dream'>Atlanta Dream</Link>
              </li>
              <li>
                <Link to='/team/chicago-sky'>Chicago Sky</Link>
              </li>
              <li>
                <Link to='/team/connecticut-sun'>Connecticut Sun</Link>
              </li>
              <li>
                <Link to='/team/dallas-wings'>Dallas Wings</Link>
              </li>
              <li>
                <Link to='/team/indiana-fever'>Indiana Fever</Link>
              </li>
              <li>
                <Link to='/team/las-vegas-aces'>Las Vegas Aces</Link>
              </li>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <h3>Support</h3>
            <FooterLinks>
              <li>
                <Link to='/contact'>Contact Us</Link>
              </li>
              <li>
                <Link to='/shipping'>Shipping Info</Link>
              </li>
              <li>
                <Link to='/returns'>Returns</Link>
              </li>
              <li>
                <Link to='/size-guide'>Size Guide</Link>
              </li>
              <li>
                <Link to='/faq'>FAQ</Link>
              </li>
            </FooterLinks>
          </FooterSection>
        </FooterGrid>

        <NewsletterSection>
          <h3 style={{color: 'var(--white)', marginBottom: '1rem'}}>
            Stay Updated
          </h3>
          <p style={{color: 'var(--gray-300)', marginBottom: '1rem'}}>
            Subscribe to our newsletter for the latest WNBA jersey releases and
            exclusive offers.
          </p>
          <NewsletterForm onSubmit={handleNewsletterSubmit}>
            <NewsletterInput
              type='email'
              placeholder='Enter your email address'
              required
            />
            <NewsletterButton type='submit'>Subscribe</NewsletterButton>
          </NewsletterForm>
        </NewsletterSection>

        <FooterBottom>
          <p>
            © 2024 WNBA Jersey Store. All rights reserved. Made with{' '}
            <FaHeart style={{color: 'var(--wnba-orange)'}} /> for WNBA fans.
          </p>
          <p style={{marginTop: '0.5rem'}}>
            This is a fan-made store and is not affiliated with the WNBA or its
            teams.
          </p>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
