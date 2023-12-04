// Create a Navigation component (Nav.js)
import React from "react";
import { Link } from "react-router-dom";
import "./styles/Nav.css"; // Import the CSS file

const Nav = () => {
  return (
    <nav>
      <ul className="nav">
        <li className="nav">
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about"> About</Link>
        </li>
        {/* Add more navigation items as needed */}
      </ul>
    </nav>
  );
};

export default Nav;
