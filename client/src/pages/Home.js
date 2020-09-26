import React from "react";
import { useAuth } from "../context/auth";
import { Link } from 'react-router-dom';
function Home(props) {
  const cc = useAuth();
  return (
    <>
      <h3 style={{ textAlign: 'center', color: 'orange' }}>Welcome to hurdle-game-MERN!</h3>
      {(!cc.authTokens || !cc.authTokens.token) && (<Link to="/login">Login to Continue</Link>)}
    </>
  );
}

export default Home;