// Login.js
import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  FacebookAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import {
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

import "./styles/Login.css"; // Import the CSS file

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        setError(null);

        const user = userCredential.user;
        console.log(user);

        addNewUser(user);
        // ...
      })
      .catch((error) => {
        setError(error.message);

        // ..
      });
  };

  const addNewUser = async (user) => {
    console.log(user);
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
    });
  };

  const handleLogin = async () => {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        setError(null);

        const user = userCredential.user;
        console.log(user);
        // ...
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleFacebookLogin = async () => {
    const provider = new FacebookAuthProvider();
    const auth = getAuth();
    await signInWithRedirect(auth, provider);
    await getRedirectResult(auth)
      .then((result) => {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        setError(null);

        const credential = FacebookAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        console.log(token);
        const user = result.user;
        console.log(user);
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        setError(error.message);

        // The email of the user's account used.
        const email = error.customData.email;
        console.log(email);
        // AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);
        console.log(credential);
        // ...
      });
  };

  return (
    <div className="login-container">
      <h1>Padel App</h1>
      <form>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        {error && <p className="error-message">{error}</p>}

        <button type="button" onClick={handleLogin}>
          Login
        </button>
        <button type="button" onClick={handleRegister} className="edit">
          Register
        </button>
        <button
          type="button"
          onClick={handleFacebookLogin}
          className="facebook-button"
          disabled
        >
          Login with Facebook
        </button>
      </form>
    </div>
  );
};

export default Login;
