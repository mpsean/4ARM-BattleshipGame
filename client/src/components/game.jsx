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
  //const [count, setCount] = useState(0);

  const [error, setError] = useState(null);

  const [count, setCount] = useState(0);

  const Navigate = useNavigate();

  const userId = sessionStorage.getItem("userId");

  const socket = getSocket(); // Get the existing socket instance

  useEffect(() => {


    // Listen for the 'countUpdated' event to update the count on all clients
    socket.on("countUpdated", (newCount) => {
      setCount(newCount);
    });

    socket.on('receiveOppPlaceShip', (data) => {
      setOppPlaceShip(data)
      console.log("get data")
    });

    // Clean up socket listeners when the component unmounts
    return () => {
      socket.off("countUpdated");
      socket.off("receiveOppPlaceShip");

    };
  }, );

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

  //GAME LOGIC ------------------------------------------------------------------------------
  
  const [myPlaceShip, setMyPlaceShip] = useState(null);
  const [oppPlaceShip, setOppPlaceShip] = useState(null);

  // Emit player data to server
  function updatePlacedShip() {
    if(myPlaceShip){
      socket.emit('sendPlayerPlaceShip', myPlaceShip);
      console.log("send data")
    }
  }



  updatePlacedShip();

  return (
<div className="flex flex-col h-screen w-screen bg-sky-400 justify-center items-center">

<div class="flex justify-center p-8">
  <img 
    src={logoImg}
    width={300}
  />
</div>

<div className="flex justify-center items-center pb-8 gap-3">

  <img
    src={clock}
    width={50}
  />
  <div className="font-museo text-white font-black text-4xl drop-shadow-lg">
    00:00
  </div>

</div>

<div>

  <h2>Count: {count}</h2>


  {/* Button to increment the count */}
  <button className="gap-2 px-6 py-3 font-montserrat font-bold text-lg leading-none ring-4 ring-white text-white rounded-full bg-sky-700 hover:bg-green-800" onClick={handleIncrement} style={buttonStyle}>
    Increment
  </button>

  {/* Button to decrement the count */}
  <button className="gap-2 px-6 py-3 font-montserrat font-bold text-lg leading-none ring-4 ring-white text-white rounded-full bg-sky-700 hover:bg-green-800" onClick={handleDecrement} style={buttonStyle}>
    Decrement
  </button>

  {/* Button to handle Win */}
  <button className="gap-2 px-6 py-3 font-montserrat font-bold text-lg leading-none ring-4 ring-white text-white rounded-full bg-sky-700 hover:bg-green-800" onClick={handleWin} style={buttonStyle}>
    Win
  </button>

  <button className="gap-2 px-6 py-3 font-montserrat font-bold text-lg leading-none ring-4 ring-white text-white rounded-full bg-sky-700 hover:bg-green-800" onClick={handleLose} style={buttonStyle}>
    Lose
  </button>
</div>

{error && <p style={{ color: "red" }}>{error}</p>}

{/* Implemented Game */}


<Main oppPlaceShip={oppPlaceShip} setMyPlaceShip={setMyPlaceShip} />


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