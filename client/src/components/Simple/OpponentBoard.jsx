import React, { useState, useRef, useEffect } from 'react';
import {
  stateToClass,
  generateEmptyLayout,
  putEntityInLayout,
  SQUARE_STATE,
  indexToCoords,
  updateSunkShips,
} from './layoutHelpers';

export const OpponentBoard = ({
  computerShips,
  gameStateOG,
  hitsByPlayer,
  setHitsByPlayer,
  handleComputerTurn,
  checkIfGameOver,
  setComputerShips,
  playSound,
}) => {

  const [gameState, setGameState] = useState('placeship');
  const playerPos = sessionStorage.getItem("playerPos");

  useEffect(() => {
    if(gameStateOG !== undefined && gameStateOG !== null){
      setGameState(gameStateOG); // start turn-> changeTurn at server
      console.log('gameStateOG changes to',gameStateOG)
    }
  }, [gameStateOG]);

  // Ships on an empty layout
  let compLayout = computerShips.reduce(
    (prevLayout, currentShip) =>
      putEntityInLayout(prevLayout, currentShip, SQUARE_STATE.ship),
    generateEmptyLayout()
  );

  //  Add hits dealt by player
  compLayout = hitsByPlayer.reduce(
    (prevLayout, currentHit) =>
      putEntityInLayout(prevLayout, currentHit, currentHit.type),
    compLayout
  );

  compLayout = computerShips.reduce(
    (prevLayout, currentShip) =>
      currentShip.sunk
        ? putEntityInLayout(prevLayout, currentShip, SQUARE_STATE.ship_sunk)
        : prevLayout,
    compLayout
  );

  // Check what's at the square and decide what next
  const fireTorpedo = (index) => {
    console.log("we sent this hit to computer")
    //if hit
    if (compLayout[index] === 'ship') {
      const newHits = [
        ...hitsByPlayer,
        {
          position: indexToCoords(index),
          type: SQUARE_STATE.hit,
        },
      ];
      setHitsByPlayer(newHits);
      return newHits;
    }
    //if miss
    if (compLayout[index] === 'empty') {
      const newHits = [
        ...hitsByPlayer,
        {
          position: indexToCoords(index),
          type: SQUARE_STATE.miss,
        },
      ];
      setHitsByPlayer(newHits);
      return newHits;
    }
  };

  const playerTurn = () => {
    if(playerPos=='player1'){
      console.log('current gameState from OPPboard P1 :',gameState)
      if(gameState === 'player1-turn'){
        return true
      }
      return false;
    }
    if(playerPos=='player2'){
      console.log('current gameState from OPPboard P2:',gameState)
      if(gameState === 'player2-turn'){
        return true
      }
      return false;
    } 
  }

  const playerCanFire = playerTurn() && !checkIfGameOver();

  let alreadyHit = (index) =>
    compLayout[index] === 'hit' ||
    compLayout[index] === 'miss' ||
    compLayout[index] === 'ship-sunk';

  let compSquares = compLayout.map((square, index) => {
    return (
      <div
        // Only display square if it's a hit, miss, or sunk ship
        className={
          stateToClass[square] === 'hit' ||
          stateToClass[square] === 'miss' ||
          stateToClass[square] === 'ship-sunk'
            ? `square ${stateToClass[square]}`
            : `square`
        }
        key={`comp-square-${index}`}
        id={`comp-square-${index}`}
        onClick={() => {
          if (playerCanFire && !alreadyHit(index)) {
            const newHits = fireTorpedo(index);
            //set newHits to opponent board
            const shipsWithSunkFlag = updateSunkShips(newHits, computerShips);
            const sunkShipsAfter = shipsWithSunkFlag.filter((ship) => ship.sunk).length;
            const sunkShipsBefore = computerShips.filter((ship) => ship.sunk).length;
            if (sunkShipsAfter > sunkShipsBefore) {
              playSound('sunk');
            }
            setComputerShips(shipsWithSunkFlag);
            handleComputerTurn();
          }
        }}
      />
    );
  });

  return (
    <div className="p-2 m-2 bg-white/25 rounded-3xl">
      <h2 className="font-museo text-2xl pt-2 font-bold text-center text-white">Computer</h2>
      <h1 className="font-museo text-xl font-medium text-center text-white">Score: 0</h1>
      <div className="board h-[400px] w-[400px] xl:h-[570px] xl:w-[570px]">{compSquares}</div>
    </div>
  );
};
