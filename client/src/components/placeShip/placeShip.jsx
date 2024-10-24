import React, { createContext, useState, useContext } from "react";
import "./placeShip.css";

const gridSize = 8


const initialGrid = Array(gridSize * gridSize).fill(null);

//keeping the ship position-----------------------------------------------------------
export const ShipPositionContext  = createContext("heelo");

// Create a provider
export const ShipPositionProvider = ({ children }) => {
  const [globalShipPosition, setGlobalShipPosition] = useState("Initial Data")
  console.log("logging "+JSON.stringify(globalShipPosition, null, 2));
  
  return (
    <ShipPositionContext.Provider value={{ globalShipPosition, setGlobalShipPosition }}>
      {children}
    </ShipPositionContext.Provider>
  );
};

// Custom hook to use the shared state
export const useGlobalShipPosition = () => {
  console.log("useGlobalShipPosition is called")
  const context = useContext(ShipPositionContext);
  if (!context) {
    throw new Error("useGlobalShipPosition must be used within a ShipPositionProvider");
  }
  return context;
};
//-----------------------------------------------------------------

// //remove this
// export const useSharedState = () => {
//   const initialShipPositions = [
//     { type: "Destroyer", position: 8 },
//     { type: "Submarine", position: 16 },
//     { type: "Battlecruiser", position: 32 },
//     { type: "Aircraftcarrier", position: 48 }
//   ];
//   const [shipPositions, setShipPositions] = useState(initialShipPositions);
//   return { shipPositions, setShipPositions };
// };
// Initialize ship 
export const createShips = (grid,importShipPositions) => {
  const newGrid = [...grid]; //get all element from inputgrid
  const shipPositions = importShipPositions

  // newGrid[8] = "Destroyer";
  // newGrid[16] = "Submarine";
  // newGrid[32] = "Battlecruiser";
  // newGrid[48] = "Aircraftcarrier";

  shipPositions.forEach(({ type, position }) => {
    newGrid[position] = type;
  });

  return newGrid;
};


const PlaceshipGrid = () => {

  //need to insert initShip bc a bug
  const initialShipPositions = [
    { type: "Destroyer", position: 8 },
    { type: "Submarine", position: 16 },
    { type: "Battlecruiser", position: 32 },
    { type: "Aircraftcarrier", position: 48 }
  ];
  const [shipPositions, setShipPositions] = useState(initialShipPositions);
  
  //set the shipPositionContext
  const {globalShipPosition , setGlobalShipPosition} = useGlobalShipPosition()



  const [grid, setGrid] = useState(createShips(initialGrid,shipPositions));
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
      console.log("this index of handledrop is "+index)
      const updatedGrid = [...grid];

      // Remove piece from its original position
      updatedGrid[currentSquare] = null;

      // Place piece at the new position
      updatedGrid[index] = draggedPiece;

      const updatedShipPosition = shipPositions.map((ship) =>
        ship.type === draggedPiece ? { ...ship, position: index } : ship
      // ship.type === draggedPiece ? { ...ship, position: 0 } : ship

      );
      
      //update shipPosition
      setShipPositions(updatedShipPosition)

      //export shipPosition
      setGlobalShipPosition(shipPositions)
      console.log("export "+JSON.stringify(shipPositions, null, 2));


      // Update the grid state
      setGrid(updatedGrid);
    } else {
      alert("This square is occupied. Choose another square.");
    }

    // Reset the drag state
    setDraggedPiece(null);
    setCurrentSquare(null);
  };

  //debug



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
