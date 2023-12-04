// Match.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

const Match = () => {
  const [matchName, setMatchName] = useState("");
  const [newPlayerName, setNewPlayerName] = useState("");
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState({});
  const { matchId } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        const matchRef = doc(db, "matches", matchId);
        const matchSnapshot = await getDoc(matchRef);

        if (matchSnapshot.exists()) {
          const matchData = matchSnapshot.data();
          setMatchName(matchData.name || "");
          setPlayers(matchData.players || []);
          setScores(matchData.scores || {});
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMatchData();
  }, [matchId]);

  const updateFirestore = async () => {
    if (matchName === "") {
      setMatchName(`${matchId}`);
    }
    const matchRef = doc(db, "matches", matchId);
    await updateDoc(matchRef, {
      name: matchName,
      players: players,
      scores: scores,
    });
  };

  const handleAddPlayer = (name) => {
    if (name.trim() === "") {
      alert("Player name cannot be empty!");
      return;
    }
    const newPlayers = [...players, name];
    setPlayers(newPlayers);
    updateFirestore();

    setScores((prevScores) => ({
      ...prevScores,
      [name]: { wins: 0, losses: 0, tosses: 0 },
    }));
    updateFirestore();
    setNewPlayerName("");
  };

  const handleIncrease = (player, result) => {
    setScores((prevScores) => {
      const updatedScores = { ...prevScores };
      updatedScores[player][result] += 1;
      return updatedScores;
    });
    updateFirestore();
  };
  const save = () => {
    updateFirestore();
  };
  const handleDecrease = (player, result) => {
    setScores((prevScores) => {
      const updatedScores = { ...prevScores };
      if (updatedScores[player][result] > 0) {
        updatedScores[player][result] -= 1;
      }
      return updatedScores;
    });
    updateFirestore();
  };

  const calculateWinRate = (player) => {
    const totalGames = scores[player].wins + scores[player].losses;
    if (totalGames === 0) {
      return 0;
    }
    console.log(totalGames);
    return (scores[player].wins / totalGames) * 100;
  };
  if (loading) {
    return <p>Loading...</p>;
  }
  const handleSortWinRate = () => {
    const sortedPlayers = [...players].sort((playerA, playerB) => {
      const winRateA = calculateWinRate(playerA);
      const winRateB = calculateWinRate(playerB);
      return winRateB - winRateA; // Sort in descending order
    });

    setPlayers(sortedPlayers);
    updateFirestore();
  };
  const handleSortTosses = () => {
    const sortedPlayers = [...players].sort((playerA, playerB) => {
      const tossesA = scores[playerA]?.tosses || 0;
      const tossesB = scores[playerB]?.tosses || 0;
      return tossesB - tossesA; // Sort in descending order
    });

    setPlayers(sortedPlayers);
    updateFirestore();
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="match-container">
      <div>
        <p className="input-field">Change Name of Match:</p>
        <input
          className="input-field"
          type="text"
          placeholder="Enter match name"
          value={matchName}
          onChange={(e) => setMatchName(e.target.value)}
        />
        <div className="input-field"></div>
        <input
          className="input-field"
          type="text"
          placeholder="Enter player name"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
        />
        <button className="edit" onClick={() => handleAddPlayer(newPlayerName)}>
          Add Player
        </button>{" "}
        <button className="edit" onClick={() => handleSortWinRate()}>
          Sort by Win Rate
        </button>
        <button className="edit" onClick={() => handleSortTosses()}>
          Sort by Tosses
        </button>
        <button className="button" onClick={() => save()}>
          Save Match
        </button>
      </div>

      {players.map((player) => (
        <div key={player} className="player">
          <h2>{player}</h2>
          <div>
            <button
              className="result-button"
              onClick={() => handleIncrease(player, "wins")}
            >
              +1 Win
            </button>
            <button
              className="delete"
              onClick={() => handleIncrease(player, "losses")}
            >
              +1 Loss
            </button>
            <button
              className=" edit"
              onClick={() => handleIncrease(player, "tosses")}
            >
              +1 Tosses
            </button>
          </div>
          <div>
            <button
              className="result-button"
              onClick={() => handleDecrease(player, "wins")}
            >
              -1 Win
            </button>
            <button
              className="delete"
              onClick={() => handleDecrease(player, "losses")}
            >
              -1 Loss
            </button>
            <button
              className=" edit"
              onClick={() => handleDecrease(player, "tosses")}
            >
              -1 Tosses
            </button>
          </div>
          <p className="player-stats">Wins: {scores[player].wins}</p>
          <p className="player-stats">Losses: {scores[player].losses}</p>
          <p className="player-stats">Tosses: {scores[player].tosses}</p>
          <p className="player-stats">
            Win Rate: {calculateWinRate(player).toFixed(2)}%
          </p>
        </div>
      ))}
    </div>
  );
};

export default Match;
