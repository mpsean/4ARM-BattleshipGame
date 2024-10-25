import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate


const WelcomeScreen = ({ startPlay }) => {
  const userId = sessionStorage.getItem("userId");
  const opponentId = "maipro"

  const Navigate = useNavigate();

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
      <h2>Your opponent is {opponentId}</h2>
      <button onClick={startGame}>Play</button>
    </div>
  );
};

export default WelcomeScreen;

