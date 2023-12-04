// MatchHistory.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  doc,
  collection,
  getDocs,
  deleteDoc,
  where,
  query,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "./firebase";

const MatchHistory = () => {
  const navigate = useNavigate(); // Get the navigate function
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const userId = auth.currentUser.uid;
        let arr = [];
        const q = query(
          collection(db, "userMatches"),
          where("userId", "==", userId)
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          arr.push(doc.data().matchId);
        });

        const matchesCollection = collection(db, "matches");
        const matchesQuery = query(
          matchesCollection,
          orderBy("timestamp", "desc")
        );
        const matchesSnapshot = await getDocs(matchesQuery);

        const matchesData = matchesSnapshot.docs
          .filter((doc) => arr.includes(doc.id)) // Filter based on arr
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setMatches(matchesData);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }
  const deleteMatch = async (matchId) => {
    const q = query(
      collection(db, "userMatches"),
      where("matchId", "==", matchId)
    );

    const querySnapshot = await getDocs(q);
    let deleteId = "";
    querySnapshot.forEach((doc) => {
      deleteId = doc.id;
    });
    await deleteDoc(doc(db, "userMatches", deleteId));
    await deleteDoc(doc(db, "matches", matchId));
    navigate("/");
  };

  return (
    <div>
      <h1>Match History</h1>
      <ul className="history">
        {matches.map((match) => (
          <li key={match.id} className="history match-container">
            <p>Match: {match.name}</p>
            <p> Date: {match.timestamp.toDate().toLocaleString()}</p>
            <Link to={`/match/${match.id}`}>
              <button className="edit">Edit Match</button>
            </Link>
            <button onClick={() => deleteMatch(match.id)} className="delete">
              Delete Match
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchHistory;
