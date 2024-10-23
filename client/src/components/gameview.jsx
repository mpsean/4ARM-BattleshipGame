import React, { useState, useEffect } from "react";
import PlaceshipGrid from './placeShip/placeShip.jsx'

const Gameview = () => {
  const [grid, setGrid] = useState([]);

  const initGrid = () => {
    const grid = Array(2).fill(null)
    const playerGrid = <PlaceshipGrid />;
    grid[0] = playerGrid;
    grid[1] = playerGrid;
    setGrid(grid)
  }
 
  useEffect(() => {
    initGrid();
  }, []);

   // Function to add a new item to the grid (not care about dragdrop)
  const addNewItemToGrid = (index) => {
    const updatedGrid = [...grid];
    updatedGrid[index] = 'drag-item'; // Adding a simple string to represent the item
    setGrid(updatedGrid);
  };

  return (
    <div   style={{display: 'flex'}}>
      {grid.map((item, index) => (
        <div key={index}>
          {item ? item : 'Empty Grid'}
        </div>
      ))}
    </div>
  );
};

export default Gameview;