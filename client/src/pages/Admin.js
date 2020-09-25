import React from "react";
import { useAuth } from "../context/auth";

function Admin(props) {
  const { setAuthTokens } = useAuth();

  function logOut() {
    setAuthTokens();
  }

  return (
    <div>
      <h1>Admin Page</h1>
      <button onClick={logOut}>Log out</button>
    </div>
  )
}

export default Admin;