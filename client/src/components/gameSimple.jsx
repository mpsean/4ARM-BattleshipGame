import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getSocket } from '../socket';
import logoImg from '../assets/images/front-logo.png';
import clock from '../assets/images/clock.png';

//import { WelcomeScreen } from './WelcomeScreen.jsx';
import { Main } from './Single/Simple/MainSimple.jsx';

import './Single/css/main.css';


const Game = () => {
  //const [count, setCount] = useState(0);

  const [error, setError] = useState(null);

  const [count, setCount] = useState(0);

  const Navigate = useNavigate();

  const userId = sessionStorage.getItem("userId");

  const socket = getSocket(); // Get the existing socket instance

  // useEffect(() => {


  //   // Listen for the 'countUpdated' event to update the count on all clients
  //   socket.on("countUpdated", (newCount) => {
  //     setCount(newCount);
  //   });

  //   socket.on('receiveOppPlaceShip', (data) => {
  //     setOppPlaceShip(data)
  //     console.log("get data")
  //   });

  //   // Clean up socket listeners when the component unmounts
  //   return () => {
  //     socket.off("countUpdated");
  //     socket.off("receiveOppPlaceShip");

  //   };
  // }, );

  //console.log(userId);
  // Function to handle incrementing the count
  const handleWin = () => {
    Navigate("/victorySingle") //victory for single
  };

  const handleLose = () => {
    Navigate("/defeatSingle")
  };


  //GAME LOGIC ------------------------------------------------------------------------------
  
  // const [myPlaceShip, setMyPlaceShip] = useState(null);
  // const [oppPlaceShip, setOppPlaceShip] = useState(null);

  // // Emit player data to server
  // function updatePlacedShip() {
  //   if(myPlaceShip){
  //     socket.emit('sendPlayerPlaceShip', myPlaceShip);
  //     console.log("send data")
  //   }
  // }



  // updatePlacedShip();

  return (
<div className="flex flex-col h-screen w-screen bg-sky-400 justify-center items-center">

<div class="flex justify-end p-8">
  <img 
    src={logoImg}
    width={300}
  />
</div>



{error && <p style={{ color: "red" }}>{error}</p>}

{/* Implemented Game */}


<Main />


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