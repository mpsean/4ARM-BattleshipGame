import React, { useState } from 'react';
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { disconnectSocket } from '../socket';


const Victory = () => {
  // Declare a state variable 'count' and a setter function 'setCount'
  const [count, setCount] = useState(0);
  const [error, setError] = useState(null);
  const Navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");


  // Function to handle incrementing the count
  const handleRematch = () => {
    Navigate("/game")
  };

  // Function to handle decrementing the count
  const handleDisconnect = () => {
    axios.put(`http://localhost:3001/result/${userId}/resetScore`)
        .then(result => {
            console.log(result);
            disconnectSocket();
            sessionStorage.removeItem("userId");
            Navigate("/login")
        })
        .catch(err => setError(console.log(err)));
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Counter: {count}</h2>
      
      {/* Button to increment the count */}
      <button onClick={handleRematch} style={buttonStyle}>
        Rematch
      </button>

      {/* Button to decrement the count */}
      <button onClick={handleDisconnect} style={buttonStyle}>
        Disconnect
      </button>
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

export default Victory;
