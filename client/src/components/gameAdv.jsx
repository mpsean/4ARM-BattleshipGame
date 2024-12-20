import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getSocket } from '../socket';
import logoImg from '../assets/images/front-logo.png';
import clock from '../assets/images/clock.png';
import dotenv from "dotenv";


//import { WelcomeScreen } from './WelcomeScreen.jsx';
import { Main } from './Adv/Main.jsx';

import './css/main.css';
import resetPage from './resetPage.jsx';


const Game = () => {
  const playerPos = sessionStorage.getItem("playerPos");

  const [error, setError] = useState(null);

  const [count, setCount] = useState(0);

  const Navigate = useNavigate();

  const userId = sessionStorage.getItem("userId");

  const socket = getSocket(); // Get the existing socket instance

  const [turn, setTurn] = useState('placement');

  //GAME LOGIC ------------------------------------------------------------------------------
  
  const [myPlaceShip, setMyPlaceShip] = useState(null);
  const [oppPlaceShip, setOppPlaceShip] = useState(null);

  const [exportHitsByPlayer, setExportHitsByPlayer] = useState(null);
  const [importHitReceived, setImportHitReceived] = useState([]);

  const opponentId = sessionStorage.getItem("opponentId");

  // Emit player data to server
  function updatePlacedShip() {
    // console.log("updatePlacedShip sent to opponent")
    if(myPlaceShip){
      socket.emit('sendPlayerPlaceShip', myPlaceShip);
      // console.log("send data")
    }
  }

  function exportHit() {
    if(exportHitsByPlayer){
      socket.emit('sendHitsByPlayer', exportHitsByPlayer);
      // console.log("send hit")
    }
  }

  useEffect(() => {
    // console.log("exportHitsByPlayer update")
    exportHit()
}, [exportHitsByPlayer]);

useEffect(() => {
  // console.log("exportHitsByPlayer update")
  updatePlacedShip();
}, [myPlaceShip]);

  useEffect(() => {

    socket.on(`serverReset`, () => {
      axios.put(`http://${import.meta.env.VITE_SERVER_IP}:3001/result/${userId}/updateMatchDraw`)
        .then((response) => {
          console.log("reset game")
          Navigate("/resetPage");
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to reset game.");
      }
        );
    });


    // Listen for the 'countUpdated' event to update the count on all clients
    socket.on("countUpdated", (newCount) => {
      setCount(newCount);
    });

    socket.on('receiveOppPlaceShip', (data) => {
      setOppPlaceShip(data)
      // console.log("get data")
    });

    socket.on('receiveHit', (data) => {
      setImportHitReceived(data)
      // console.log("get hit")
    });

    // Clean up socket listeners when the component unmounts
    return () => {
      socket.off("serverReset");
      socket.off("countUpdated");
      socket.off("receiveOppPlaceShip");
      socket.off("receiveHit");

    };
  }, []);

  useEffect(() => {
    socket.on('turnChanged', (data) => {
      setTurn(data.currentTurn)
      console.log('game.jsx turnChanged get',data.currentTurn)
    });

    // Clean up socket listeners when the component unmounts
    return () => {
      socket.off("turnChanged");

    };
  },[turn]);

  useEffect(() => {
    showState();
  },[turn]);

  //console.log(userId);
  // Function to handle incrementing the count
  const handleWin = () => {
    axios.put(`http://${import.meta.env.VITE_SERVER_IP}:3001/result/${userId}/updateMatchWon`)
    axios.put(`http://${import.meta.env.VITE_SERVER_IP}:3001/result/${userId}/updateScoreAdv`)
        .then(result => {
            Navigate("/victoryAdv")
        })
        .catch(err => setError(console.log(err)));
  };

  const handleLose = () => {
    axios.put(`http://${import.meta.env.VITE_SERVER_IP}:3001/result/${userId}/updateMatchLose`)
    Navigate("/defeatAdv")
  };

  const handleIncrement = () => {
    const socket = getSocket(); // Get the socket instance
    const newCount = count + 1;
    setCount(newCount); // Update the local state

    // Emit the updated count to the server to sync with all clients
    socket.emit("updateCount", newCount);
  };

  const handleDecrement = () => {
    const socket = getSocket(); // Get the socket instance
    const newCount = count - 1;
    setCount(newCount); // Update the local state

    // Emit the updated count to the server to sync with all clients
    socket.emit("updateCount", newCount);
  };

  const [exportState, setExportState] = useState(); //use in page

  const showState = () => {
    if(playerPos=='player1'){
      if(turn=='player1-turn'){
        setExportState(userId+ " 's turn!")
      }
      if(turn=='player2-turn'){
        setExportState(opponentId+ " 's turn!")
      }
    }

    if(playerPos=='player2'){
      if(turn=='player2-turn'){
        setExportState(userId + " 's turn!")
      }
      if(turn=='player1-turn'){
        setExportState(opponentId+ " 's turn!")
      }
    }
  }


  //updatePlacedShip();
  //exportHit()


  return (
<div className="flex flex-col min-h-screen min-w-screen bg-sky-400 dark:bg-sky-800 justify-center items-center">

<div class="flex justify-center p-8">
  <img 
    src={logoImg}
    width={200}
  />
</div>



<div>

  <div className="font-museo text-white font-medium text-5xl drop-shadow-lg w-20 whitespace-nowrap text-center">
      <div>
      {exportState} 
      </div>
  </div>

  
</div>

{error && <p style={{ color: "red" }}>{error}</p>}

{/* Implemented Game */}


<Main 
oppPlaceShip={oppPlaceShip} 
setMyPlaceShip={setMyPlaceShip} 
setExportHitsByPlayer={setExportHitsByPlayer} 
importHitReceived={importHitReceived}
turn={turn}
setTurn={setTurn}
Socket={socket}/>

</div>
);
};

// Optional inline styling for buttons
const buttonStyle = {
padding: '10px 20px',
margin: '10px',
fontSize: '16px',
cursor: 'pointer',
};

export default Game;