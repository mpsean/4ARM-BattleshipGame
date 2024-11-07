import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { disconnectSocket } from "../socket";
import defeatAvatar from "../assets/images/avatar-lose.png";
import defeatHeader from "../assets/images/defeat-header.png";
import { getSocket } from "../socket";

const Defeat = () => {
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
    axios
      .get(`http://localhost:3001/result/${userId}/getScoreAdv`)
      .then((response) => {
        setUserScore(response.data.score); // Set the user's latest score
      })
      .catch((err) => {
        console.error("Error fetching user score:", err);
        setError("Failed to load user score.");
      });

    // Fetch the latest opponent score
    axios
      .get(`http://localhost:3001/result/${opponentId}/getScoreAdv`)
      .then((response) => {
        setOpponentScore(response.data.score); // Set the opponent's latest score
      })
      .catch((err) => {
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
    Navigate("/WelcomeScreenAdv");
  };

  // Function to handle decrementing the count
  const handleDisconnect = () => {
    axios
      .put(`http://localhost:3001/result/${userId}/resetScoreAdv`)
      .then((result) => {
        disconnectSocket();
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("opponentId");
        Navigate("/login");
      })
      .catch((err) => setError(console.log(err)));
  };


  const statusClass = opponentStatus === "online" ? "bg-green-700" : "bg-red-700";
  return (
    // <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <section class="flex min-h-screen min-w-screen bg-gray-500 dark:bg-gray-700 justify-center items-center">
    <div class="flex flex-col justify-center">
      <div class="flex justify-center items-center">
      <img 
          src={defeatHeader}
          width= {650}
      />
      </div>
      <div class="flex justify-center items-center">
        <h2 class="font-museo text-2xl text-white font-bold p-5">
          {opponentId} won. {/**put name var here */}
        </h2>
      </div>
      <div class="flex flex-col justify-between items-center gap-2 p-5">
        <div class="flex flex-1 items-center w-3/5">
          <p class="font-museo font-medium text-3xl text-white w-96">{opponentId}</p>
          <div class="flex gap-8 w-48 justify-center">
            <p class="font-museo font-medium text-3xl w-12 text-white text-center">{opponentScore}</p>
            <div className={`${statusClass} w-24`}>
            </div>
          </div>
        </div>
          <div class="flex flex-1 items-center w-3/5">
            <p class="font-museo font-medium text-3xl text-white w-96">
              {userId}
            </p>
            <div class="flex gap-8 w-48 justify-center">
              <p class="font-museo font-medium text-3xl w-12 text-white text-center">
                {userScore}
              </p>
              <div class="bg-green-700 w-24">
              </div>
            </div>
          </div>
      </div>

      <div class="grid grid-cols-3 items-end gap-x-28 lg:gap-x-40">
        <button onClick={handleRematch} className="flex justify-center items-center gap-2 px-7 py-4 border-4 h-16 font-montserrat font-bold text-xl leading-none text-white rounded-full bg-sky-700 dark:bg-sky-950 hover:bg-green-800">
            Rematch
        </button>
        <img
          src={defeatAvatar}
          width={200}
        />
        <button onClick={handleDisconnect} className="flex justify-center items-center gap-2 px-7 py-4 border-4 h-16 font-montserrat font-bold text-xl leading-none text-white rounded-full bg-sky-700 dark:bg-sky-950 hover:bg-green-800">
            Disconnect
          </button>
        </div>
      </div>
    </section>
  );
};

export default Defeat;
