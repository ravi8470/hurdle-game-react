import Axios from "axios";
import React, { useState } from "react";
import { Link, Redirect } from 'react-router-dom';
import { useAuth } from "../context/auth";
import { REGISTER_URL } from "../constants/Urls";

function Signup() {

  const [isSignedUp, setSignedUp] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setAuthTokens } = useAuth();

  function doSignUp(e) {
    e.preventDefault();
    if(password !== confirmPassword){
      setIsError(true);
      return;
    }
    Axios.post(REGISTER_URL, {
      email: userName,
      password
    }).then(result => {
      if (result.status === 200) {
        setAuthTokens(result.data);
        setSignedUp(true);
      } else {
        setIsError(true);
      }
    }).catch(e => {
      setIsError(true);
    });
  }

  if (isSignedUp) {
    return <Redirect to="/game" />;
  }

  return (
    <>
      <form onSubmit={e => {doSignUp(e)}}>
        <input type="email" placeholder="email" required value={userName}
          onChange={e => {
            setUserName(e.target.value);
          }} /><br />
        <input type="password" placeholder="password" required value={password}
          onChange={e => {
            setPassword(e.target.value);
          }} />Minimum 8 chars<br />
        <input type="password" placeholder="confirm password" required value={confirmPassword}
          onChange={e => {
            setConfirmPassword(e.target.value);
          }} /><br />
        <input type='submit' value='Sign Up' />
      </form>
      <Link to="/login">Already have an account?</Link><br/>
      { isError && <small style={{ color: 'red' }}>Error in signing up!</small>}
    </>
  );
}

export default Signup;