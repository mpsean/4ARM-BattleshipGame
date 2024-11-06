import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { disconnectSocket } from "../socket";
import defeatAvatar from "../assets/images/avatar-lose.png";
import defeatHeader from "../assets/images/defeat-header.png";
import { getSocket } from "../socket";

const resetPage = () => {
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
      .put(`http://localhost:3001/user/${userId}/deleteUserSimple`)
      .then((result) => {
        disconnectSocket();
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("opponentId");
        Navigate("/loginSimple");
      })
      .catch((err) => setError(console.log(err)));
  };


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
          The server has been reset.
        </h2>
      </div>

      <div class="grid grid-cols-3 items-end gap-x-28 lg:gap-x-40">
        <button onClick={handleDisconnect} className="flex justify-center items-center gap-2 px-7 py-4 border-4 h-16 font-montserrat font-bold text-xl leading-none text-white rounded-full bg-sky-700 dark:bg-sky-950 hover:bg-green-800">
            Disconnect
          </button>
        </div>
      </div>
    </section>
  );
};

export default resetPage;
