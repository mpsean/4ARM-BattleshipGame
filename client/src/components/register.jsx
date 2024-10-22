import logoImg from '../assets/images/front-logo.png';
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
    axios.post(`http://localhost:3001/user/register`, { nickname, password })
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
    <section class="relative bg-front bg-cover bg-gray-800 bg-blend-normal h-screen w-screen bg-no-repeat bg-center py-16 px-24 flex items-center justify-center">
    <div class="flex-grow-0 justify-center px-36 py-16 bg-white/70 rounded-3xl">
      <img 
        src={logoImg}
        width={300}
      />
      <h1 class="font-montserrat pt-4 font-bold text-3xl text-sky-900">Sign Up</h1>
      
      
      <h2>Currently online: n users</h2>
      <h1 class="font-bold font-montserrat">Enter a nickname and password.</h1>
      
      {/* Form submission logic with React */}
      <form class="font-montserrat" id="nameForm" onSubmit={handleSubmit}>
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
      <p class="font-montserrat font-medium text-sky-900">Already have an account? <Link class="font-bold underline" to="/user/login">Login</Link></p>  
    </div>
    </section>
  );
};

export default register;