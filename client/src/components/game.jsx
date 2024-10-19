import React, { useState } from 'react';
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Game = () => {
  // Declare a state variable 'count' and a setter function 'setCount'
  const [count, setCount] = useState(0);

  const [error, setError] = useState(null);

  const Navigate = useNavigate();

  const userId = sessionStorage.getItem("userId");
  console.log(userId);
  // Function to handle incrementing the count
  const handleWin = () => {
      axios.put("http://localhost:3001/result/${userId}/updateScore")
          .then(result => {
              console.log(result);
              Navigate("/victory")
          })
          .catch(err => setError(console.log(err)));
  };

  // Function to handle decrementing the count
  const handleLose = () => {
    axios.put("http://localhost:3001/result/${userId}/resetScore")
    .then(result => {
        console.log(result);
        Navigate("/defeat")
    })
    .catch(err => setError(console.log(err)));
};
//   const handleWin = () => {
//     setCount(count + 1);
//   };
//   const handleLose = () => {
//     setCount(count - 1);
//   };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Counter: {count}</h2>
      
      {/* Button to increment the count */}
      <button onClick={handleWin} style={buttonStyle}>
        Win
      </button>

      {/* Button to decrement the count */}
      <button onClick={handleLose} style={buttonStyle}>
        Lose
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

export default Game;