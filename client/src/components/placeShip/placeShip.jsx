import React, { useState } from "react";
import "./placeShip.css";

const gridSize = 8;
const squareSize = 80;

const initialGrid = Array(gridSize * gridSize).fill(null);

// Initialize pawns for both players
const initializeShips = (grid) => {
  const newGrid = [...grid];

  newGrid[8] = "Destroyer";
  newGrid[16] = "Submarine";
  newGrid[32] = "Battlecruiser";
  newGrid[48] = "Aircraftcarrier";

  return newGrid;
};

const PlaceshipGrid = () => {
  const [grid, setGrid] = useState(initializeShips(initialGrid));
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [currentSquare, setCurrentSquare] = useState(null);

  // Handle when dragging starts
  const handleDragStart = (e, ship, index) => {
    setDraggedPiece(ship);
    setCurrentSquare(index);
  };

  // Handle when dragging over a square (prevent default to allow drop)
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle dropping of the piece, snap it to the nearest square
  const handleDrop = (e, index) => {
    if (!grid[index]) {  // Check if the target square is empty
      const updatedGrid = [...grid];

      // Remove piece from its original position
      updatedGrid[currentSquare] = null;

      // Place piece at the new position
      updatedGrid[index] = draggedPiece;

      // Update the grid state
      setGrid(updatedGrid);
    } else {
      alert("This square is occupied. Choose another square.");
    }

    // Reset the drag state
    setDraggedPiece(null);
    setCurrentSquare(null);
  };

  // Render chessboard
  const renderGrid = () => {
    return grid.map((ship, index) => {
      //const isWhiteSquare = (Math.floor(index / gridSize) + (index % gridSize)) % 2 === 0;
      //const squareColor = isWhiteSquare ? "white-square" : "black-square";

      return (
        <div
          key={index}
          className={`square ${index}`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
        >
          {ship && (
            <div
              className={`ship ${ship}`}
              draggable
              onDragStart={(e) => handleDragStart(e, ship, index)}
              style={{ position: "relative", top: 0, left: 0 }}
            />
          )}
        </div>
      );
    });
  };

  return <div className="grid">{renderGrid()}</div>;
};

export default PlaceshipGrid;
