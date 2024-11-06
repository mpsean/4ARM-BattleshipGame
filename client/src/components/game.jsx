import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getSocket } from '../socket';
import logoImg from '../assets/images/front-logo.png';
import clock from '../assets/images/clock.png';

//import { WelcomeScreen } from './WelcomeScreen.jsx';
import { Main } from './Simple/Main.jsx';

import './css/main.css';


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
    axios.put(`http://localhost:3001/result/${userId}/updateScore`)
        .then(result => {
            Navigate("/victory")
        })
        .catch(err => setError(console.log(err)));
  };

  const handleLose = () => {
    Navigate("/defeat")
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
        setExportState(userId,'shoot before timer ran out!')
      }
      if(turn=='player2-turn'){
        setExportState(opponentId,'shoot before timer ran out!')
      }
    }

    if(playerPos=='player2'){
      if(turn=='player2-turn'){
        setExportState(userId,'shoot before timer ran out!')
      }
      if(turn=='player1-turn'){
        setExportState(opponentId,'shoot before timer ran out!')
      }
    }
    
    // if(gameState=='placement'){
    //   setExportState("place your ship")
    // }
    // if(gameState=='gameover'){
    //   setExportState("gameover")
    // }
    
    

  }
  


  return (
<div className="flex flex-col min-h-screen min-w-screen bg-sky-400 dark:bg-sky-800 justify-center items-center">

<div class="flex justify-center p-8">
  <img 
    src={logoImg}
    width={200}
  />
</div>



<div>

  <h2>Count: {count}</h2>
  <h1>player : {playerPos}</h1>
  <h1>playerID : {userId}</h1>
  <h1>opponentId : {opponentId}</h1>
  <h1>Turn : {turn}</h1>

  <div className="font-museo text-white font-medium text-5xl drop-shadow-lg w-6 whitespace-nowrap text-center">
      <div>
      This is {exportState}'s turn to shoot! 
      </div>
  </div>

  {/* Button to increment the count */}
  <button className="gap-2 px-6 py-3 font-montserrat font-bold text-lg leading-none ring-4 ring-white text-white rounded-full bg-sky-700 dark:bg-sky-950 hover:bg-green-800" onClick={handleIncrement} style={buttonStyle}>
    Increment
  </button>

  {/* Button to decrement the count */}
  <button className="gap-2 px-6 py-3 font-montserrat font-bold text-lg leading-none ring-4 ring-white text-white rounded-full bg-sky-700 dark:bg-sky-950 hover:bg-green-800" onClick={handleDecrement} style={buttonStyle}>
    Decrement
  </button>

  {/* Button to handle Win */}
  <button className="gap-2 px-6 py-3 font-montserrat font-bold text-lg leading-none ring-4 ring-white text-white rounded-full bg-sky-700 dark:bg-sky-950 hover:bg-green-800" onClick={handleWin} style={buttonStyle}>
    Win
  </button>

  <button className="gap-2 px-6 py-3 font-montserrat font-bold text-lg leading-none ring-4 ring-white text-white rounded-full bg-sky-700 dark:bg-sky-950 hover:bg-green-800" onClick={handleLose} style={buttonStyle}>
    Lose
  </button>
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