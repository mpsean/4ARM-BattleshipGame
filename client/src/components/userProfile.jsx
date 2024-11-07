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
    <div className="min-h-screen min-w-screen bg-sky-300 dark:bg-sky-900">
      <h2  className="text-center font-montserrat pt-4 font-bold text-3xl text-sky-900 m-2 dark:text-white">User Profile</h2>
      {/* Conditional rendering based on the userData state */}
      {userData === null ? (
        <p className="text-center font-montserrat pt-4 font-normal text-3xl text-sky-900 m-2 dark:text-white">Loading data...</p> // Show a loading message if data hasn't been fetched yet
      ) : (
        <div>
          <h3 className="text-center font-montserrat pt-4 font-bold text-6xl text-sky-900 m-2 dark:text-white">{userData.nickname}</h3>
        </div>
      )}
      <div className="m-10 rounded-lg bg-white dark:bg-sky-700 py-1">
        <p className="text-center font-montserrat pt-4 font-normal text-xl text-sky-900 m-2 dark:text-white">Matches Played: {userData.matchPlayed}</p>
        <p className="text-center font-montserrat pt-4 font-normal text-xl text-sky-900 m-2 dark:text-white">Matches Won: {userData.matchWon}</p>
        <p className="text-center font-montserrat pt-4 font-normal text-xl text-sky-900 m-2 dark:text-white">Matches Lost: {userData.matchLose}</p>
        <p className="text-center font-montserrat pt-4 font-normal text-xl text-sky-900 m-2 dark:text-white">Matches Draw: {userData.matchDraw}</p>
      </div>
      <button
        onClick={handleBack}
        className="justify-center items-center gap-2 px-7 py-4 border-4 h-16 font-montserrat font-bold text-xl leading-none text-white rounded-full bg-sky-700 dark:bg-sky-950 hover:bg-green-800"
      >
        Back
      </button>
    </div>
  );
};

export default Profile;
