import logoImg from '../assets/images/front-logo.png';
import React, { useState } from 'react';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


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
    <section class="relative bg-front bg-cover dark:bg-black/20 dark:bg-blend-darken h-screen w-screen bg-no-repeat bg-center py-16 px-24 flex items-center justify-center">
    <div class="flex-grow-0 justify-center px-36 py-16 bg-white/70 dark:bg-white/30 rounded-3xl">
    <div class="flex justify-center">
        <img 
          src={logoImg}
          width={300}
        />
      </div>
      <div class="flex justify-center">
      <h1 class="font-montserrat pt-4 font-bold text-3xl text-sky-900 m-2">Sign Up</h1>
      </div>
      
      <h1 class="font-bold font-museo text-center">Enter a nickname and password.</h1>
      
      {/* Form submission logic with React */}
      <form class="font-montserrat justify-center text-center bg-white dark:bg-cyan-800 m-2 p-5 border-1 rounded-2xl shadow-lg" id="nameForm" onSubmit={handleSubmit}>
        {/* Label omitted for simplicity */}
        <input 
          type="text" 
          name="nickname" 
          placeholder="Nickname" 
          class="p-3 w-full max-w-80 border rounded-md dark:bg-slate-300 border-gray-400/50"
          required 
          value={nickname} 
          onChange={(e) => setnickname(e.target.value)} // Handle input change
        />
        <br /><br />
        <input 
          type="password" 
          name="password" 
          placeholder="Password"
          class="p-3 w-full max-w-80 border rounded-md dark:bg-slate-300 border-gray-400/50" 
          required 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} // Handle input change
        />
        <br /><br />
        <button className="gap-2 px-6 py-3 font-montserrat font-bold text-lg leading-none text-white rounded-full bg-sky-700 dark:bg-sky-950  hover:bg-green-800" type="submit">Sign Up</button>
      </form>
      

      {/* Display error if there is one */} 
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p class="font-museo font-medium text-center text-sky-950">Already have an account? <Link class="font-bold underline" to="/login">Login</Link></p>  
    </div>
    </section>
  );
};

export default register;