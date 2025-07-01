import React from 'react';
import {Link} from 'react-router-dom';
import {FaStar, FaShoppingCart, FaHeart, FaEye} from 'react-icons/fa';
import {useDispatch, useSelector} from 'react-redux';
import {addToCart} from '../slices/cartSlice';
import {addToFavorites, removeFromFavorites} from '../slices/favoritesSlice';

// Seattle Storm player name to player ID mapping
const seattlePlayerIds = {
  'Alysha Clark': '924',
  'Nneka Ogwumike': '1068',
  'Skylar Diggins': '2491205',
  'Erica Wheeler': '2491214',
  'Lexie Brown': '3058892',
  'Gabby Williams': '3142328',
  'Katie Lou Samuelson': '3917453',
  'Ezi Magbegor': '4420318',
  'Zia Cooke': '4432832',
  'Mackenzie Holmes': '4433643',
  'Dominique Malonga': '5220150',
};

const ProductCard = ({product}) => {
  const dispatch = useDispatch();
  const {favorites} = useSelector((state) => state.favorites);
  const isFavorite = favorites.find(
    (x) => (x._id || x.id) === (product._id || product.id)
  );

  const addToCartHandler = () => {
    // Ensure the product has _id for cart compatibility
    const cartItem = {
      ...product,
      _id: product._id || product.id, // Use _id if available, otherwise use id
      qty: 1,
    };
    dispatch(addToCart(cartItem));
  };

  const toggleFavoriteHandler = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(product._id || product.id));
    } else {
      // Ensure the product has _id for favorites compatibility
      const favoriteItem = {
        ...product,
        _id: product._id || product.id,
      };
      dispatch(addToFavorites(favoriteItem));
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className='headshot-stars'
        style={{
          color: index < rating ? '#ffc107' : '#e5e7eb',
        }}
      />
    ));
  };

  const getTeamClass = (teamName) => {
    return teamName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  };

  const getPositionClass = (playerName) => {
    if (!playerName) return 'position-guard'; // Default if no name
    if (playerName.includes('Guard')) return 'position-guard';
    if (playerName.includes('Forward')) return 'position-forward';
    if (playerName.includes('Center')) return 'position-center';
    return 'position-guard'; // Default
  };

  // Use the product._id or product.id for routing (handle both database and local data)
  const playerId = product._id || product.id;

  return (
    <div
      className='headshot-card fade-in-up'
      style={{
        background: 'var(--white)',
        border: '1.5px solid var(--gray-200)',
        borderRadius: '1.25rem',
        boxShadow: '0 2px 12px rgba(30,58,138,0.07)',
      }}
    >
      <div
        className='headshot-container'
        style={{
          padding: 0,
          background: 'var(--gray-50)',
          minHeight: 180,
          position: 'relative',
          overflow: 'hidden',
          borderTopLeftRadius: '1.25rem',
          borderTopRightRadius: '1.25rem',
        }}
      >
        <Link
          to={`/player/${playerId}`}
          style={{display: 'block'}}
        >
          <img
            src={product.image}
            alt={product.name}
            className='player-headshot'
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '1.25rem 1.25rem 0 0',
              border: 'none',
              boxShadow: 'none',
              marginBottom: 0,
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
        </Link>
        {/* Modern overlay bar for team name and jersey number */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(30,58,138,0.92)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderBottomLeftRadius: '1.25rem',
            borderBottomRightRadius: '1.25rem',
            zIndex: 2,
          }}
        >
          <span style={{fontWeight: 700, fontSize: 15, letterSpacing: 0.5}}>
            {product.team}
          </span>
          {product.jerseyNumber && (
            <span
              style={{
                background: 'var(--wnba-orange)',
                color: 'white',
                fontWeight: 700,
                fontSize: 15,
                borderRadius: 16,
                padding: '2px 12px',
                marginLeft: 8,
                boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
              }}
            >
              #{product.jerseyNumber}
            </span>
          )}
        </div>
        {/* Top Seller Badge */}
        {product.totalSold > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              background: '#ffb347',
              color: '#fff',
              fontWeight: 700,
              fontSize: 12,
              borderRadius: 12,
              padding: '2px 10px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            }}
          >
            🔥 Top Seller
          </div>
        )}
      </div>
      <div
        className='headshot-card-body'
        style={{
          padding: '0.9rem 1rem 1.1rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'var(--white)',
        }}
      >
        <h3
          className='player-name'
          style={{
            fontSize: 17,
            fontWeight: 700,
            margin: '0.4rem 0 0.2rem 0',
            textAlign: 'center',
            color: 'var(--gray-900)',
          }}
        >
          <Link
            to={`/player/${playerId}`}
            style={{textDecoration: 'none', color: '#222'}}
          >
            {product.name}
          </Link>
        </h3>
        {/* Position Badge */}
        <div
          className={`position-badge ${getPositionClass(product.position)}`}
          style={{margin: '0.2rem 0 0.5rem 0'}}
        >
          {product.position || 'Player'}
        </div>
        <div
          className='headshot-rating-container'
          style={{marginBottom: 6}}
        >
          <div className='headshot-stars'>
            {renderStars(Math.floor(product.rating))}
          </div>
          <span className='headshot-rating-text'>({product.numReviews})</span>
        </div>
        <div
          className='headshot-price-container'
          style={{margin: '0.4rem 0 0.7rem 0'}}
        >
          <div
            className='headshot-price'
            style={{fontSize: 16, fontWeight: 700, color: 'var(--wnba-orange)'}}
          >
            ${product.price}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 10,
            width: '100%',
            justifyContent: 'center',
            margin: '0.5rem 0',
          }}
        >
          <button
            onClick={addToCartHandler}
            className='headshot-add-to-cart-btn'
            disabled={product.countInStock === 0}
            style={{
              padding: '7px 14px',
              borderRadius: 20,
              fontSize: 15,
              background: 'var(--wnba-orange)',
              color: 'white',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontWeight: 600,
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            }}
            title='Add to Cart'
          >
            <FaShoppingCart />
          </button>
          <button
            onClick={toggleFavoriteHandler}
            className='headshot-overlay-button'
            style={{
              background: isFavorite ? 'var(--wnba-blue)' : 'var(--gray-200)',
              color: isFavorite ? 'white' : 'var(--wnba-orange)',
              border: 'none',
              borderRadius: 20,
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            }}
            title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          >
            <FaHeart />
          </button>
        </div>
        <div
          className={`headshot-stock-status ${
            product.countInStock > 0
              ? 'headshot-stock-in'
              : 'headshot-stock-out'
          }`}
          style={{
            fontSize: 13,
            fontWeight: 600,
            marginTop: 2,
            color:
              product.countInStock > 0 ? 'var(--wnba-green)' : 'var(--red-600)',
          }}
        >
          {product.countInStock > 0
            ? `${product.countInStock} in stock`
            : 'Out of stock'}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
