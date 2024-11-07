import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { disconnectSocket } from "../socket";
import stalemateHeader from "../assets/images/stalemate-header.png";
import { getSocket } from "../socket";
import dotenv from "dotenv";


const ResetPage = () => {
  const [error, setError] = useState(null);
  const Navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");
  const opponentId = sessionStorage.getItem("opponentId");
  const socket = getSocket(); // Get the existing socket instance

  useEffect(() => {
    if (!userId || !opponentId) {
      console.error("User or opponent ID is missing");
      setError("User or opponent information is missing.");
      return;
    }

      return() => {
        socket.off(`userDisconnected`);
      }

  }, [userId, opponentId]);

  // Function to handle decrementing the count
  const handleDisconnect = () => {
    axios
      .put(`http://${import.meta.env.VITE_SERVER_IP}:3001/user/${userId}/deleteUserSimple`)
      .then((result) => {
        disconnectSocket();
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("opponentId");
        sessionStorage.removeItem("IsRematch");
        Navigate("/");
      })
      .catch((err) => setError(console.log(err)));
  };


  return (
    // <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <section class="flex min-h-screen min-w-screen bg-gray-500 dark:bg-gray-700 justify-center items-center">
    <div class="flex flex-col justify-center">
      <div class="flex justify-center items-center">
      <img 
          src={stalemateHeader}
          width= {650}
      />
      </div>
      <div class="flex justify-center items-center">
        <h2 class="font-museo text-2xl text-white font-bold p-10">
          The server has been reset.
        </h2>
      </div>
      <div class="flex justify-center items-center">
      <button onClick={handleDisconnect} className="max-w-60 items-center gap-2 px-7 py-4 border-4 h-16 font-montserrat font-bold text-xl leading-none text-white rounded-full bg-sky-700 dark:bg-sky-950 hover:bg-green-800">
            Disconnect
      </button>
      </div>
      </div>
    </section>
  );
};

export default ResetPage;
