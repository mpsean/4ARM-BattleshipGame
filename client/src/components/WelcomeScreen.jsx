import React from 'react';

export const WelcomeScreen = ({ startPlay }) => {
  const userId = sessionStorage.getItem("userId");
  const opponentId = "maipro"

  //Wait for non

  // const opponentId = sessionStorage.getItem("opponentId");

  // useEffect(() => {
  //   if (!userId || !opponentId) {
  //     console.error("User or opponent ID is missing");
  //     setError("User or opponent information is missing.");
  //     return;
  //   } },[userId, opponentId]);

  return (
    <main>
      <h2 className="tip-box-title">Rules</h2>
      <h2>Welcome {userId}</h2>
      <p className="player-tip">
        You and your opponent are competing navy commanders. Your fleets are positioned at
        secret coordinates, and you take turns firing torpedoes at each other. The first
        to sink the other person’s whole fleet wins!
      </p>
      <h2>Your opponent is {opponentId}</h2>
      <button onClick={startPlay}>Play</button>
    </main>
  );
};
