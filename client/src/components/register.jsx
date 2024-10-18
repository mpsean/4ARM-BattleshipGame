import React, { useState } from 'react';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './styles.css'; // Ensure you have styles set up


const register = () => {
  const [nickname, setnickname] = useState('');
  const [password, setPassword] = useState('');
  //const [displayName, setDisplayName] = useState('...');
 
  //error
  const [error, setError] = useState(null); // Error state to display any error messages
  
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3001/register", { nickname, password })
        .then(result => {
            if (result.status === 201) {
                navigate("/login");
            }
        })
        .catch(err => {
            if (err.response && err.response.status === 400) {
                window.alert("Error");
            } else {
                console.log(err);
            }
        });
};


  return (
    <div>
      <h2>Currently online: n users</h2>
      <h1>Enter your nickname</h1>
      
      {/* Form submission logic with React */}
      <form id="nameForm" onSubmit={handleSubmit}>
        {/* Label omitted for simplicity */}
        <input 
          type="text" 
          name="nickname" 
          placeholder="Your nickname here" 
          required 
          value={nickname} 
          onChange={(e) => setnickname(e.target.value)} // Handle input change
        />
        <br /><br />
        <input 
          type="text" 
          name="password" 
          placeholder="Your password here" 
          required 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} // Handle input change
        />
        <br /><br />
        <button type="submit">Join Game</button>
      </form>
      

      {/* Display error if there is one */} 
      {error && <p style={{ color: 'red' }}>{error}</p>}

    </div>
  );
};

export default register;