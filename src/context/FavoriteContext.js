import React, { createContext, useState, useContext, useEffect } from 'react';

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (listing) => {
    const isAlreadyFavorite = favorites.some(fav => fav.id === listing.id);
    
    if (!isAlreadyFavorite) {
      setFavorites(prev => [...prev, listing]);
    } else {
      alert('Bu ilan zaten favorilerinizde!');
    }
  };

  const removeFromFavorites = (listingId) => {
    setFavorites(prev => prev.filter(item => item.id !== listingId));
  };

  const isFavorite = (listingId) => {
    return favorites.some(item => item.id === listingId);
  };

  return (
    <FavoriteContext.Provider 
      value={{ 
        favorites, 
        addToFavorites, 
        removeFromFavorites,
        isFavorite 
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoriteContext); 