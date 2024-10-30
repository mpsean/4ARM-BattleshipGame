import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getSocket } from '../socket';


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

    // Clean up socket listeners when the component unmounts
    return () => {
      socket.off("roomJoined");
      socket.off("userJoined");
    };
  }, [room,socket]);



  //Wait for non

  // const opponentId = sessionStorage.getItem("opponentId");

  // useEffect(() => {
  //   if (!userId || !opponentId) {
  //     console.error("User or opponent ID is missing");
  //     setError("User or opponent information is missing.");
  //     return;
  //   } },[userId, opponentId]);

  const startGame = () => {
    Navigate("/game")
  };

  return (
    <div>
      <h2 className="tip-box-title">Rules</h2>
      <h2>Welcome {userId}</h2>
      <p className="player-tip">
        You and your opponent are competing navy commanders. Your fleets are positioned at
        secret coordinates, and you take turns firing torpedoes at each other. The first
        to sink the other person’s whole fleet wins!
      </p>
      <h2>Your opponent is {opponentName}</h2>
      <button onClick={startGame}>Play</button>
    </div>
  );
};

export default WelcomeScreen;

