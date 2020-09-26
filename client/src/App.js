import React, { useState } from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import PrivateRoute from './PrivateRoute';
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import { AuthContext } from "./context/auth";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Game from "./pages/Game";
import './App.css'

function App(props) {
  const existingTokens = JSON.parse(localStorage.getItem("tokens"));
  const [authTokens, setAuthTokens] = useState(existingTokens);

  const setTokens = (data) => {
    if(!data){
      localStorage.removeItem("tokens");
    } else {
      localStorage.setItem("tokens", JSON.stringify(data));
    }
    setAuthTokens(data)
  }
  const logout = () => {
    setTokens(null);
  }
  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/">Home Page</Link>
            </li>
            {/* <li>
              <Link to="/admin">Admin Page</Link>
            </li> */}
            <li>
              <Link to="/game">Game Page</Link>
            </li>
            {(existingTokens) && (<button className='logOutBtn' onClick={() => logout()}>Logout</button>)}
          </ul>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Signup} />
          {/* <PrivateRoute path="/admin" component={Admin} /> */}
          <PrivateRoute path="/game" component={Game} />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;