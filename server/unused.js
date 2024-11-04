import React, { useState, useRef, useEffect } from 'react';
import { GameView } from './GameView';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import clock from '../../assets/images/clock.png';
import {
  placeAllComputerShips,
  SQUARE_STATE,
  indexToCoords,
  putEntityInLayout,
  generateEmptyLayout,
  generateRandomIndex,
  getNeighbors,
  updateSunkShips,
  coordsToIndex,
} from './layoutHelpers';

const AVAILABLE_SHIPS = [
  { name: 'carrier', length: 4, placed: null },
  { name: 'battleship', length: 4, placed: null },
  { name: 'cruiser', length: 4, placed: null },
  { name: 'submarine', length: 4, placed: null },
  { name: 'destroyer', length: 4, placed: null },
];

export const Main = ({ oppPlaceShip, setMyPlaceShip, setExportHitsByPlayer, importHitReceived }) => { 
  const [gameState, setGameState] = useState('placement');
  const [winner, setWinner] = useState(null);

  const [placedShips, setPlacedShips] = useState([]);
  const [availableShips, setAvailableShips] = useState(AVAILABLE_SHIPS);
  const [computerShips, setComputerShips] = useState([]);
  const [hitsByPlayer, setHitsByPlayer] = useState([]);
  const [hitsByComputer, setHitsByComputer] = useState([]);

  const Navigate = useNavigate();
  const initExportHit = useRef(false); 
  const initImportHit = useRef(false); 

  const placeHit = (coords) => {
    if (gameState === 'player1-turn') {
      setHitsByPlayer([...hitsByPlayer, { position: coords, type: SQUARE_STATE.hit }]);
      exportHitToParent();
      changeTurn(); // Move turn to the computer
    } else {
      console.log("Not player's turn yet!");
    }
  };

  const startTurn = () => {
    console.log("start");
    sendDataToParent();
    generateComputerShips();
    setGameState('player1-turn');
    startTimer();
  };

  const changeTurn = () => {
    setGameState((oldGameState) =>
      oldGameState === 'player1-turn' ? 'player2-turn' : 'player1-turn'
    );
    resetTimer();
  };

  const exportHitToParent = () => {
    const data = hitsByPlayer;
    setExportHitsByPlayer(data);
  };

  const importHit = () => {
    const data = importHitReceived;
    setHitsByComputer(data);
  };

  useEffect(() => {
    if (initExportHit.current) {
      setTimeout(() => {
        exportHitToParent();
        changeTurn();
      }, 300);
    } else {
      initExportHit.current = true;
    }
  }, [hitsByPlayer]);

  useEffect(() => {
    if (initImportHit.current) {
      setTimeout(() => {
        importHit();
        changeTurn();
      }, 300);
    } else {
      initImportHit.current = true;
    }
  }, [importHitReceived]);

  const checkIfGameOver = () => {
    let successfulPlayerHits = hitsByPlayer.filter((hit) => hit.type === 'hit').length;
    let successfulComputerHits = hitsByComputer.filter((hit) => hit.type === 'hit').length;

    if (successfulComputerHits === 20 || successfulPlayerHits === 20) {
      setGameState('game-over');

      if (successfulComputerHits === 20) {
        setWinner('computer');
      }
      if (successfulPlayerHits === 20) {
        setWinner('player');
      }

      return true;
    }
    return false;
  };

  useEffect(() => {
    if (gameState === 'game-over' && winner === 'player') {
      axios.put(`http://localhost:3001/result/${userId}/updateScore`)
        .then(() => Navigate("/victory"))
        .catch(err => console.log(err));
    } 
    if (gameState === 'game-over' && winner === 'computer') {
      Navigate('/defeat');
    } 
  }, [gameState, winner, Navigate]);

  return (
    <React.Fragment>
      <div className="flex justify-center items-center pb-2 gap-3">
        <img src={clock} width={50} />
        <div className="font-museo text-white font-black text-3xl drop-shadow-lg w-6 text-center">
          {seconds}
        </div>
      </div>

      <GameView
        availableShips={availableShips}
        placeHit={placeHit}
        gameState={gameState}
        hitsByPlayer={hitsByPlayer}
        startTurn={startTurn}
        computerShips={computerShips}
        checkIfGameOver={checkIfGameOver}
      />
    </React.Fragment>
  );
};
