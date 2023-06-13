import { apiPath } from "../assets/apiPath";
import React, { useState } from "react";
import "../assets/login.css";

interface bodyCredentials {
  username: string;
  password: string;
}

function tryLogin(credentials: bodyCredentials) {
  return fetch(`${apiPath}/api/login`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
}

function setToken(token: string) {
  localStorage.setItem("token", token);
}

function Login() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [checkedToken, setCheckedToken] = useState(false);

  if (!checkedToken) handleTokenCheck();
  async function handleTokenCheck() {
    if (localStorage.getItem("token") == null) {
    } else {
      let data = await fetch(`${apiPath}/api/checktoken`, {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (data.status == 401) {
      } else {
        window.location.replace("/");
      }
    }

    setCheckedToken(true);
  }

  function handleUserName(e: React.FormEvent<HTMLInputElement>) {
    let username = e.currentTarget.value;
    if (username.length < 3) {
      setUsernameError("username too short");
    } else setUsernameError("");
    setUserName(username);
  }

  function handlePassword(e: React.FormEvent<HTMLInputElement>) {
    setPassword(e.currentTarget.value);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await tryLogin({
      username: username,
      password: password,
    });
    if (data.status != 200) {
      setLoginError("Bad Login/Password");
    } else {
      setLoginError("");
      let token = await data.json();
      setToken(token.token);
      window.location.replace("/");
    }
  };

  return (
    <div id="form-box">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div id="text-inputs">
          <br />
          <label htmlFor="Login">Login</label> <br />
          {usernameError != "" ? (
            <>
              <span className="error-message">{usernameError}</span> <br />
            </>
          ) : (
            <></>
          )}
          <input type="text" onChange={handleUserName} placeholder="Login" />
          <br />
          <label htmlFor="password">Password</label> <br />
          {passwordError != "" ? (
            <>
              <span className="error-message">{passwordError}</span> <br />
            </>
          ) : (
            <></>
          )}
          <input
            type="password"
            onChange={handlePassword}
            placeholder="Password"
          />
          <br />
        </div>

        <span className="error-message">{loginError}</span>

        <button type="submit" className="submit-button">
          LOGIN
        </button>
      </form>
      <div id="extra-buttons">
        <button className="forgot-button">Forgot Password</button>
        <button className="register-button">Register</button>
      </div>
    </div>
  );
}

export default Login;
