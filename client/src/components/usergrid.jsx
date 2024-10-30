// ThemeContext.js
import React, { createContext, useState, useContext } from 'react';

// Create the context
const UserShipContext = createContext();

// Create a provider component
export const UserShipProvider = ({ children }) => {
  const [usership, setUserShip] = useState([]); // Initial grid is empty grid

  // updateShip
  const updateShip = (ship) => {
    setUserShip((ship));
  };

  return (
    <ThemeContext.Provider value={{ usership, updateShip }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the ThemeContext easily in other components
export const useUserShipContext = () => useContext(UserShipContext);
