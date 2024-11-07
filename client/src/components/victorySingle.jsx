import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { disconnectSocket } from '../socket';
import avatarWin from "../assets/images/avatar-win.png";
import victoryHeader from "../assets/images/victory-header.png";

const Victory = () => {
  const [userScore, setUserScore] = useState(0);
  // const [opponentScore, setOpponentScore] = useState(0);
  const [error, setError] = useState(null);
  const Navigate = useNavigate();
  // const userId = sessionStorage.getItem("userId");
  // const opponentId = sessionStorage.getItem("opponentId");

  // useEffect(() => {
  //   if (!userId || !opponentId) {
  //     console.error("User or opponent ID is missing");
  //     setError("User or opponent information is missing.");
  //     return;
  //   }

  //   // Fetch the latest user score
  //   axios.get(`http://localhost:3001/result/${userId}/getScore`)
  //     .then(response => {
  //       setUserScore(response.data.score); // Set the user's latest score
  //     })
  //     .catch(err => {
  //       console.error("Error fetching user score:", err);
  //       setError("Failed to load user score.");
  //     });

  //   // Fetch the latest opponent score
  //   axios.get(`http://localhost:3001/result/${opponentId}/getScore`)
  //     .then(response => {
  //       setOpponentScore(response.data.score); // Set the opponent's latest score
  //     })
  //     .catch(err => {
  //       console.error("Error fetching opponent score:", err);
  //       setError("Failed to load opponent score.");
  //     });
  // }, [userId, opponentId]);

  // Function to handle incrementing the count
  const handleRematch = () => {
    Navigate("/gameSingle")
  };

  // Function to handle decrementing the count
  const handleDisconnect = () => {
    Navigate("/")
  };

  return (
    // <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <section class="flex h-screen w-screen bg-gray-500 justify-center items-center">
    <div class="flex flex-col justify-center h-700 w-300">
      <div class="flex justify-center items-center">
      <img 
          src={victoryHeader}
          width= {800}
          class=""
      />

        
        
      </div>

      <div class="flex justify-center items-center">
      <img
          src={avatarWin}
          height={100}
          width={200}
          class="row-start-1 row-span-2"
        />
      </div>
      


      <div class="flex justify-center py-16 gap-40">

        <button onClick={handleDisconnect} className="flex justify-center w-60 items-center gap-2 px-20 py-4 border-4 h-16 font-montserrat font-bold text-xl leading-none text-white rounded-full bg-sky-700 hover:bg-green-800">
            Home
        </button>

      </div>
    </div>
    </section>
  );
};

export default Victory;
