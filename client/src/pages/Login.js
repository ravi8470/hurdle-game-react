import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from 'axios';
import { useAuth } from "../context/auth";
import { LOGIN_URL } from "../constants/Urls";

function Login(props) {

  // const referer = props.location && props.location.state && props.location.state.referer || '/';
  const referer = props?.location?.state?.referer || '/';

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthTokens } = useAuth();

  function doLogin(e) {
    e.preventDefault();
    axios.post(LOGIN_URL, { email: userName, password }).then(result => {
      console.log(result)
      if (result.status === 200) {
        setAuthTokens(result.data);
        setLoggedIn(true);
      } else {
        setIsError(true);
      }
    }).catch(e => {
      console.log(e.response)
      console.log('isloggedin', isLoggedIn)
      setIsError(true);
    });
  }

  if (isLoggedIn) {
    console.log('inside isloggedin')
    return <Redirect to={referer} />;
  }
  return (
    <>
      <form onSubmit={(e) => {doLogin(e)}}>
        <input type="email" placeholder="email" value={userName}
          onChange={e => {
            setUserName(e.target.value);
          }} /><br />
        <input type="password" placeholder="password" value={password}
          onChange={e => {
            setPassword(e.target.value);
          }} /><br />
        <input type="submit" value="Login"/>
      </form>
      <Link to="/register">Don't have an account?</Link><br/>
      { isError && <small style={{ color: 'red' }}>The username or password provided were incorrect!</small>}
    </>
  );
}

export default Login;