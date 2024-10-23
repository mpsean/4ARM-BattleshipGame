import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getSocket } from '../socket';
import Gameview from './gameview.jsx'


const Game = () => {
  //const [count, setCount] = useState(0);

  const [error, setError] = useState(null);

  const [count, setCount] = useState(0);

  const [room, setRoom] = useState('testroom');

  const [opponentName, setOpponentName] = useState(null);

  const Navigate = useNavigate();

  const userId = sessionStorage.getItem("userId");

  const socket = getSocket(); // Get the existing socket instance

  useEffect(() => {

    socket.emit('joinRoom', {room: room, playerName: userId});

    // Listen for the 'countUpdated' event to update the count on all clients
    socket.on("countUpdated", (newCount) => {
      setCount(newCount);
    });

    socket.on('roomJoined', (room) => {
        console.log(`Joined room ${room}`);
        setRoom(room);
        });

    
        socket.on("userJoined", (name) => {
          setOpponentName(name); // Store opponent's name
          sessionStorage.setItem("opponentId", name);
          console.log(`Your opponent is: ${name}`);
        });

    // Clean up socket listeners when the component unmounts
    return () => {
      socket.off("countUpdated");
      socket.off("roomJoined");
      socket.off("userJoined");
    };
  }, [room,socket]);

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

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Count: {count}</h2>
      
      {/* Button to increment the count */}
      <button onClick={handleIncrement} style={buttonStyle}>
        Increment
      </button>

      {/* Button to decrement the count */}
      <button onClick={handleDecrement} style={buttonStyle}>
        Decrement
      </button>

      {/* Button to handle Win */}
      <button onClick={handleWin} style={buttonStyle}>
        Win
      </button>

      <button onClick={handleLose} style={buttonStyle}>
        Lose
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Gameview/>

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