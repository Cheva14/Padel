// Home.js
import React from "react";
import { auth, db } from "./firebase";
import { Link, useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";

const Home = () => {
  const navigate = useNavigate(); // Get the navigate function

  const signOut = () => {
    auth.signOut();
  };

  const startMatch = async () => {
    const matchRef = await addDoc(collection(db, "matches"), {
      timestamp: new Date(),
    });
    console.log("Document written with ID: ", matchRef.id);

    const userId = auth.currentUser.uid;
    const docRef = await addDoc(collection(db, "userMatches"), {
      userId: userId,
      matchId: matchRef.id,
    });
    console.log("Document written with ID: ", docRef.id);

    // Redirect to the match page (you may want to define the route in your React Router setup)
    navigate(`/match/${matchRef.id}`);
  };

  return (
    <div>
      <h1>Padel Match Tracker</h1>
      <p>Welcome to the app!</p>
      <button onClick={startMatch}>Start Match</button>
      <Link to="/match-history">
        <button className="edit">See past matches</button>
      </Link>{" "}
      <button onClick={signOut} className="delete">
        Sign Out
      </button>
    </div>
  );
};

export default Home;
