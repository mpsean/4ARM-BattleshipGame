import logoImg from '../assets/images/front-logo.png';
import React, { useState } from 'react';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { initSocket } from '../socket';

function loginSimple({ setIsLoggedIn, isLoggedIn }) {
  const [nickname , setnickname] = useState("");

  const [error, setError] = useState(null); // Error state to display any error messages

  const navigate = useNavigate();

  const handleSubmit  = (e) => {
      e.preventDefault();
      axios.post(`http://localhost:3001/user/loginSimple`, { nickname })
          .then(result => {
              if (result.data.message === "Login successful") {
                console.log("Login successful")

                const userData = result.data.savedUser; // Adjust based on your actual response structure
                console.log(userData);
                const userID = result.data.savedUser.nickname;
                console.log(userID);
                

                initSocket(); // Initialize the socket connection

                sessionStorage.setItem("userId", userID);
                
                // Navigate to the home page with user data
                navigate("/welcomescreen", { state: { user: userData } });
              } 
              if (result.data.message === "Username already exist"){
                console.log("client error")

                  alert("Login failed: Username already exist");
              }
          })
          .catch(err => setError(console.log(err)));
  };
  return (
    <section class="relative bg-front bg-cover dark:bg-black/20 dark:bg-blend-darken h-screen w-screen bg-no-repeat bg-center py-16 px-24 flex flex-col items-center justify-center">
    <div class="justify-center px-36 py-16 bg-white/70 dark:bg-white/30 rounded-3xl">
      <div class="flex justify-center">
        <img 
          src={logoImg}
          width={300}
        />
      </div>
      <div class="flex justify-center">
        <h1 class="font-montserrat pt-4 font-bold text-3xl text-sky-900 m-2">Login</h1>
      </div>

      
      {/* Form submission logic with React */}
      <form class="font-montserrat justify-center text-center bg-sky-300 dark:bg-cyan-800 m-2 p-5 border-1 rounded-2xl shadow-lg" id="nameForm" onSubmit={handleSubmit}>
        {/* Label omitted for simplicity */}
        <input 
          type="text" 
          name="nickname" 
          placeholder="Username" 
          class="p-3 w-full max-w-80 border rounded-md border-gray-400/50 dark:bg-slate-300"
          required 
          value={nickname} 
          onChange={(e) => setnickname(e.target.value)} // Handle input change
        />
        <br /><br />
        <br /><br />
        <button className="gap-2 px-6 py-3 font-montserrat font-bold text-lg leading-none text-white rounded-full bg-sky-700 dark:bg-sky-950 hover:bg-green-800" type="submit">Join Game</button>
      </form>


      {/* Display error if there is one */} 
      {error && <p style={{ color: 'red' }}>{error}</p>}

    </div>
    </section>
  );
};


export default loginSimple;
