import React, { useState } from 'react';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function login({ setIsLoggedIn, isLoggedIn }) {
  const [nickname , setnickname] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null); // Error state to display any error messages

  const navigate = useNavigate();

  const handleSubmit  = (e) => {
      e.preventDefault();
      axios.post("http://localhost:3001/login", { nickname, password })
          .then(result => {
              if (result.data.message === "Login successful") {
                console.log("Login successful")

                const userData = result.data.user; // Adjust based on your actual response structure
                
                // Navigate to the home page with user data
                navigate("/home", { state: { user: userData } });
              } 
              if (result.data.message === "Invalid credentials") {
                console.log("Invalid credentials")
                alert("Invalid credentials");
              }
              if (result.data.message === "User doesnt exist"){
                console.log("client error")

                  alert("Login failed");
              }
          })
          .catch(err => setError(console.log(err)));
  };
  return (
    <div>
      <h1>This is login page</h1>
      
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
      
      <p>Don't have an account? <Link to="/register">SignUp</Link></p>      

      {/* Display error if there is one */} 
      {error && <p style={{ color: 'red' }}>{error}</p>}

    </div>
  );
};


export default login;
