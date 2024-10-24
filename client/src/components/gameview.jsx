import React, { useState, useEffect } from "react";
import PlaceshipGrid, {createShips} from './placeShip/placeShip.jsx'

const Gameview = () => {
  const [grid, setGrid] = useState([]);

  const initGrid = () => {
    const igrid = Array(2).fill(null)
    const playerGrid = <PlaceshipGrid />;
    const button = <button onClick={() => addNewItemToGrid()}>Add Item</button>
    console.log("yooooooooooo")
    igrid[0] = playerGrid;
    igrid[1] = button;
    setGrid(igrid)
  }
 
  useEffect(() => {
    initGrid();
  }, []);

   // Function to start playing game after placeship
  const addNewItemToGrid = () => {
    const updatedGrid = [...grid];

    const playerGrid = <PlaceshipGrid />;


    //update playergrid(playerGrid)
    updatedGrid[0] = playerGrid; 

    //add enemygrid

    //append all grid

    updatedGrid[1] = playerGrid; 
    setGrid(updatedGrid);
  };

  return (
    <div style={{display: 'flex'}}>
      {grid.map((item, index) => (
        <div key={index}>
          {item ? item : 'Empty Grid'}
        </div>
      ))}
    </div>
  );
};

export default Gameview;