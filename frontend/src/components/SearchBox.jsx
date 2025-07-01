import React, {useState, useEffect} from 'react';
import {Form, Button, InputGroup} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import {FaSearch, FaTimes} from 'react-icons/fa';
import axios from 'axios';

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

const StyledInputGroup = styled(InputGroup)`
  .form-control {
    border: 2px solid var(--gray-200);
    border-radius: 50px;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    transition: all 0.2s ease;
    background: var(--white);

    &:focus {
      border-color: var(--wnba-orange);
      box-shadow: 0 0 0 0.2rem rgba(255, 107, 53, 0.25);
      outline: none;
    }

    &::placeholder {
      color: var(--gray-400);
    }
  }

  .btn {
    border-radius: 50px;
    border: none;
    padding: 0.75rem 1.5rem;
    background: var(--gradient-primary);
    color: var(--white);
    font-weight: 600;
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }

    &:focus {
      box-shadow: 0 0 0 0.2rem rgba(255, 107, 53, 0.25);
    }
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 60px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    color: var(--wnba-orange);
    background: var(--gray-100);
  }
`;

const SearchSuggestions = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 0.5rem;
`;

const SuggestionItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid var(--gray-100);
  transition: background-color 0.2s ease;

  &:hover {
    background: var(--gray-50);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const SuggestionTitle = styled.div`
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 0.25rem;
`;

const SuggestionSubtitle = styled.div`
  font-size: 0.875rem;
  color: var(--gray-600);
`;

const SearchBox = () => {
  const [keyword, setKeyword] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch suggestions from backend
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        // Fetch all products without pagination for suggestions
        const {data} = await axios.get('/api/products?pageSize=1000');
        const allProducts = data.products;

        // Create suggestions from real data
        const productSuggestions = allProducts.map((product) => ({
          title: product.player || product.name,
          subtitle: product.team,
          type: 'player',
          productId: product._id, // Store product ID for direct navigation
        }));

        // Add team suggestions (full name only)
        const teams = [...new Set(allProducts.map((p) => p.team))];
        const teamSuggestions = teams.map((team) => ({
          title: team,
          subtitle: 'Team',
          type: 'team',
          productId: null, // Teams don't have a specific product ID
        }));

        // Combine suggestions (do not slice here)
        const allSuggestions = [...teamSuggestions, ...productSuggestions];
        setSuggestions(allSuggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        // Fallback to static suggestions if API fails
        setSuggestions([
          {
            title: 'Breanna Stewart',
            subtitle: 'New York Liberty',
            type: 'player',
            productId: null,
          },
          {
            title: "A'ja Wilson",
            subtitle: 'Las Vegas Aces',
            type: 'player',
            productId: null,
          },
          {
            title: 'Caitlin Clark',
            subtitle: 'Indiana Fever',
            type: 'player',
            productId: null,
          },
          {
            title: 'Angel Reese',
            subtitle: 'Chicago Sky',
            type: 'player',
            productId: null,
          },
          {
            title: 'Rhyne Howard',
            subtitle: 'Atlanta Dream',
            type: 'player',
            productId: null,
          },
          {
            title: 'Paige Bueckers',
            subtitle: 'Dallas Wings',
            type: 'player',
            productId: null,
          },
          {
            title: 'Atlanta Dream',
            subtitle: 'Team',
            type: 'team',
            productId: null,
          },
          {
            title: 'Chicago Sky',
            subtitle: 'Team',
            type: 'team',
            productId: null,
          },
          {
            title: 'New York Liberty',
            subtitle: 'Team',
            type: 'team',
            productId: null,
          },
          {
            title: 'Las Vegas Aces',
            subtitle: 'Team',
            type: 'team',
            productId: null,
          },
          {
            title: 'Indiana Fever',
            subtitle: 'Team',
            type: 'team',
            productId: null,
          },
          {
            title: 'Dallas Wings',
            subtitle: 'Team',
            type: 'team',
            productId: null,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      const encodedKeyword = encodeURIComponent(keyword.trim());
      navigate(`/search/${encodedKeyword}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setKeyword(suggestion.title);
    setShowSuggestions(false);

    // If it's a player suggestion with a product ID, go directly to the product page
    if (suggestion.type === 'player' && suggestion.productId) {
      navigate(`/product/${suggestion.productId}`);
    } else {
      // For teams or suggestions without product IDs, go to search results
      const encodedSuggestion = encodeURIComponent(suggestion.title);
      navigate(`/search/${encodedSuggestion}`);
    }
  };

  const clearSearch = () => {
    setKeyword('');
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    setShowSuggestions(value.length > 0);
  };

  const handleInputFocus = () => {
    setShowSuggestions(keyword.length > 0);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.title.toLowerCase().includes(keyword.toLowerCase()) ||
      suggestion.subtitle.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <SearchContainer>
      <Form onSubmit={submitHandler}>
        <StyledInputGroup>
          <Form.Control
            type='text'
            name='q'
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder='Search jerseys, players, teams...'
            value={keyword}
          />
          {keyword && (
            <ClearButton
              onClick={clearSearch}
              type='button'
            >
              <FaTimes />
            </ClearButton>
          )}
          <Button
            type='submit'
            variant='primary'
          >
            <FaSearch />
          </Button>
        </StyledInputGroup>
      </Form>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <SearchSuggestions>
          {loading ? (
            <SuggestionItem>
              <SuggestionTitle>Loading suggestions...</SuggestionTitle>
            </SuggestionItem>
          ) : (
            filteredSuggestions.slice(0, 8).map((suggestion, index) => (
              <SuggestionItem
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <SuggestionTitle>{suggestion.title}</SuggestionTitle>
                <SuggestionSubtitle>{suggestion.subtitle}</SuggestionSubtitle>
              </SuggestionItem>
            ))
          )}
        </SearchSuggestions>
      )}
    </SearchContainer>
  );
};

export default SearchBox;
