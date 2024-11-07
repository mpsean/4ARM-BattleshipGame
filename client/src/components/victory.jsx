import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { disconnectSocket } from '../socket';
import avatarWin from "../assets/images/avatar-win.png";
import victoryHeader from "../assets/images/victory-header.png";
import { getSocket } from '../socket';

const Victory = () => {
  const [userScore, setUserScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [error, setError] = useState(null);
  const Navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");
  const opponentId = sessionStorage.getItem("opponentId");
  const [opponentStatus, setOpponentStatus] = useState("online");
  const socket = getSocket(); // Get the existing socket instance

  useEffect(() => {

    if (!userId || !opponentId) {
      console.error("User or opponent ID is missing");
      setError("User or opponent information is missing.");
      return;
    }

    // Fetch the latest user score
    axios.get(`http://localhost:3001/result/${userId}/getScore`)
      .then(response => {
        setUserScore(response.data.score); // Set the user's latest score
      })
      .catch(err => {
        console.error("Error fetching user score:", err);
        setError("Failed to load user score.");
      });

    // Fetch the latest opponent score
    axios.get(`http://localhost:3001/result/${opponentId}/getScore`)
      .then(response => {
        setOpponentScore(response.data.score); // Set the opponent's latest score
      })
      .catch(err => {
        console.error("Error fetching opponent score:", err);
        setError("Failed to load opponent score.");
      });

      socket.on(`userDisconnected`, (data) => {
        setOpponentStatus("offline");
      }
      );

      return() => {
        socket.off(`userDisconnected`);
      }

  }, [userId, opponentId]);
  // Function to handle incrementing the count
  const handleRematch = () => {
    Navigate("/WelcomeScreen");
    console.log("winner opp :",sessionStorage.getItem(`opponentId`))
  };

  // Function to handle decrementing the count
  const handleDisconnect = () => {
    axios
      .put(`http://localhost:3001/result/${userId}/resetScore`)
      .then((result) => {
      })
      .catch((err) => setError(console.log(err)));
    axios
      .put(`http://localhost:3001/user/${userId}/deleteUserSimple`)
      .then((result) => {
        disconnectSocket();
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("opponentId");
        sessionStorage.removeItem("IsRematch");
        Navigate("/loginSimple");
      })
      .catch((err) => setError(console.log(err)));
  };

  const statusClass = opponentStatus === "online" ? "bg-green-700" : "bg-red-700";

  return (
    // <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <section class="flex min-h-screen w-screen bg-gray-500 dark:bg-gray-700 justify-center items-center">
    <div class="flex flex-col justify-center">
      <div class="flex justify-center items-center">
      <img 
          src={victoryHeader}
          width= {650}
          class=""
      />
      </div>
      <div class="flex justify-center items-center">
        <h2 class="font-museo text-2xl text-white font-bold p-5">
          Great work, {userId}. {/**put name var here */}
        </h2>
      </div>
      <div class="flex flex-col justify-between items-center gap-2 pb-5">
        <div class="flex flex-1 items-center w-3/5">
          <p class="font-montserrat font-medium text-3xl text-white w-96">{userId}</p>
          <div class="flex gap-8 w-48 justify-center">
            <p class="font-montserrat font-medium text-3xl w-12 text-white text-center">{userScore}</p>
            <div class="bg-green-700 w-24">
            </div>
          </div>
        </div>
        <div class="flex flex-1 items-center w-3/5">
          <p class="font-montserrat font-medium text-3xl text-white w-96">{opponentId}</p>
          <div class="flex gap-8 w-48 justify-center">
            <p class="font-montserrat font-medium text-3xl w-12 text-white text-center">{opponentScore}</p>
            <div className={`${statusClass} w-24`}>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-3 items-end gap-x-28 lg:gap-x-40">
        <button onClick={handleRematch} className="flex justify-center items-center gap-2 px-7 py-4 border-4 h-16 font-montserrat font-bold text-xl leading-none text-white rounded-full bg-sky-700 dark:bg-sky-950 hover:bg-green-800">
            Rematch
        </button>
        <div className="flex justify-center">
          <img
            src={avatarWin}
            width={150}
          />
        </div>
        <button onClick={handleDisconnect} className="flex justify-center items-center gap-2 px-7 py-4 border-4 h-16 font-montserrat font-bold text-xl leading-none text-white rounded-full bg-sky-700 dark:bg-sky-950 hover:bg-green-800">
            Disconnect
        </button>
      </div>
    </div>
    </section>
  );
};

export default Victory;
