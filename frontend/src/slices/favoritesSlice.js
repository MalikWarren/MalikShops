import {createSlice} from '@reduxjs/toolkit';

// Get favorites from localStorage
const getFavoritesFromStorage = () => {
  const favorites = localStorage.getItem('favorites');
  return favorites ? JSON.parse(favorites) : [];
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    favorites: getFavoritesFromStorage(),
  },
  reducers: {
    addToFavorites: (state, action) => {
      const product = action.payload;
      const exists = state.favorites.find((x) => x._id === product._id);

      if (!exists) {
        state.favorites.push(product);
        // Save to localStorage
        localStorage.setItem('favorites', JSON.stringify(state.favorites));
      }
    },
    removeFromFavorites: (state, action) => {
      const productId = action.payload;
      state.favorites = state.favorites.filter((x) => x._id !== productId);
      // Save to localStorage
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    clearFavorites: (state) => {
      state.favorites = [];
      // Clear from localStorage
      localStorage.removeItem('favorites');
    },
  },
});

export const {addToFavorites, removeFromFavorites, clearFavorites} =
  favoritesSlice.actions;

export default favoritesSlice.reducer;
