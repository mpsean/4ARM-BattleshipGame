import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getSocket } from '../socket';

import logoImg from '../assets/images/front-logo.png';

const WelcomeScreen = ({ startPlay }) => {
  const userId = sessionStorage.getItem("userId");

  const Navigate = useNavigate();

  const [error, setError] = useState(null);

  const [room, setRoom] = useState('testroom');

  const [opponentName, setOpponentName] = useState(null);

  const socket = getSocket(); // Get the existing socket instance

  useEffect(() => {

    socket.emit('joinRoom', {room: room, playerName: userId});

    socket.on('roomJoined', (room) => {
        console.log(`Joined room ${room}`);
        setRoom(room);
        });

        socket.on("userJoined", (name) => {
          setOpponentName(name); // Store opponent's name
          sessionStorage.setItem("opponentId", name);
          console.log(`Your opponent is: ${name}`);
        });

        socket.on('playerAssigned', (data) => {
          sessionStorage.setItem("playerPos", data.role);
          console.log(`You are assigned as ${data.role}`);

        });

    // Clean up socket listeners when the component unmounts
    return () => {
      socket.off("roomJoined");
      socket.off("userJoined");
      socket.off("playerAssigned");


    };
  }, [room,socket]);

  const startGame = () => {
    Navigate("/game")
    console.log(sessionStorage.getItem("playerPos"))
  };

  return (
    <div class="bg-front bg-cover bg-black/20 bg-blend-darken h-screen w-screen bg-no-repeat bg-center py-16 px-24 flex flex-col items-center justify-center">
       <img 
          src={logoImg}
          width={300}
          className="pb-8"
      />
      <h1 className="font-montserrat text-3xl font-black text-white drop-shadow-xl">Rules</h1>
      <div className="flex flex-col px-24 py-12 bg-white/20 rounded-3xl max-w-screen-lg m-6">
        <div className="flex justify-center">
          <h2 className='font-museo text-white font-bold text-2xl text-center'>Welcome {userId}.</h2>
        </div>
        <p className="font-museo text-white font-medium text-lg indent-12">
          You and your opponent are competing navy commanders. Your fleets are positioned at
          secret coordinates, and you take turns firing torpedoes at each other. The first
          to sink the other person’s whole fleet wins!
        </p>
        <div className="flex justify-center">
          <h2 className="font-museo text-white font-bold text-xl">Your opponent is {opponentName}.</h2>
        </div>
      </div>
      <button className="flex justify-center items-center gap-2 px-7 py-4 font-montserrat font-bold text-xl leading-none ring-4 ring-white text-white rounded-full bg-sky-700 hover:bg-green-800" onClick={startGame}>Play</button>
    </div>
  );
};

export default WelcomeScreen;

