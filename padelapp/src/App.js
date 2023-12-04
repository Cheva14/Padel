// App.js
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import { auth } from "./firebase";
import Home from "./Home";
import Login from "./Login";
import About from "./About";
import Match from "./Match";
import MatchHistory from "./MatchHistory";
import Nav from "./Nav";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/match/:matchId"
          element={user ? <Match /> : <Navigate to="/login" />}
        />
        <Route
          path="/match-history"
          element={user ? <MatchHistory /> : <Navigate to="/login" />}
        />
        <Route path="/about" element={<About />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
