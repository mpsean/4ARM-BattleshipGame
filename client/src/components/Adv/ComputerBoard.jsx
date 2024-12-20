import React from 'react';
import {
  stateToClass,
  generateEmptyLayout,
  putEntityInLayout,
  SQUARE_STATE,
  indexToCoords,
  updateSunkShips,
} from './layoutHelpers';

export const ComputerBoard = ({
  computerShips,
  gameState,
  hitsByPlayer,
  setHitsByPlayer,
  handleComputerTurn,
  checkIfGameOver,
  setComputerShips,
  playSound,
}) => {
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

  const playerTurn = gameState === 'player1-turn';
  const playerCanFire = playerTurn && !checkIfGameOver();

  // Check what's at the square and decide what next
  const fireTorpedo = (index) => {
    console.log("gameState fire ",gameState)
    console.log("playerCanFire",playerCanFire)
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
      <h2 className="font-museo text-2xl font-bold pt-2 text-center text-white">Opponent</h2>
      <h1 className="font-museo text-xl font-medium text-center text-white">Score: 0</h1>
      <div className="board h-[400px] w-[400px] xl:h-[570px] xl:w-[570px]">{compSquares}</div>
    </div>
  );
};
