import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  // State to store data
  const [userData, setuserData] = useState(null);
  const searchId = sessionStorage.getItem("searchId");
  const Navigate = useNavigate();

  // Fetch user data when the component mounts
  useEffect(() => {
    axios
      .get(`http://localhost:3001/user/${searchId}/getUser`)
      .then((response) => {
        console.log("API Response:", response.data); // Log response
        setuserData(response.data);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
      });
  }, [searchId]); // Depend on searchId so it refetches when it changes

  // Log userData when it changes
  useEffect(() => {
    console.log("User data updated:", userData); // Logs updated user data
  }, [userData]); // Runs whenever userData changes

  const handleBack = () => {
    sessionStorage.removeItem("searchId");
    Navigate("/");
  };

  return (
    <div>
      <h2>User Profile</h2>
      {/* Conditional rendering based on the userData state */}
      {userData === null ? (
        <p>Loading data...</p> // Show a loading message if data hasn't been fetched yet
      ) : (
        <div>
          <h3>{userData.nickname}</h3>
          <p>Matches Played: {userData.matchPlayed}</p>
          <p>Matches Won: {userData.matchWon}</p>
          <p>Matches Lost: {userData.matchLose}</p>
          <p>Matches Draw: {userData.matchDraw}</p>
        </div>
      )}
      <button
        onClick={handleBack}
        className="flex justify-center items-center gap-2 px-7 py-4 border-4 h-16 font-montserrat font-bold text-xl leading-none text-white rounded-full bg-sky-700 dark:bg-sky-950 hover:bg-green-800"
      >
        Back
      </button>
    </div>
  );
};

export default Profile;
