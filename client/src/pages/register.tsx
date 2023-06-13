import React, { useState } from "react";
import { apiPath } from "../assets/apiPath";
import "../assets/register.css";

function Register() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.includes(" ")) {
      setUsernameError("Username cannot contain spaces");
      return;
    } else if (username.length > 24) {
      setUsernameError("Username too long");
      return;
    } else if (username.length < 3) {
      setUsernameError("Username too short");
      return;
    } else {
      setUsernameError("");
    }

    if (password.length < 8) {
      setPasswordError("Password is too short");
      return;
    } else if (password.length > 32) {
      setPasswordError("Password too long");
      return;
    } else {
      setPasswordError("");
    }

    const credentials = {
      username: username,
      password: password,
      email: email,
    };

    const data = await fetch(`${apiPath}/api/login`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (data.status != 200) {
      console.log(data);
    } else {
      // window.location.replace("/login");
    }
  };

  function hadleChangeMail(e: React.FormEvent<HTMLInputElement>) {
    let mail = e.currentTarget.value;
    setEmail(mail);
  }

  function hadleChangePassword(e: React.FormEvent<HTMLInputElement>) {
    let password = e.currentTarget.value;
    setPassword(password);
  }

  function hadleChangeLogin(e: React.FormEvent<HTMLInputElement>) {
    let login = e.currentTarget.value;
    setUserName(login);
  }

  return (
    <div id="form-box">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div id="text-inputs">
          <label htmlFor="email">E-mail</label> <br />
          <input
            type="email"
            placeholder="e-mail"
            required
            onChange={hadleChangeMail}
          />
          <br />
          <label htmlFor="Login">Login</label> <br />
          {usernameError != "" ? (
            <>
              <span className="error-message-register">{usernameError}</span>{" "}
              <br />
            </>
          ) : (
            <></>
          )}
          <input
            type="text"
            placeholder="Login"
            required
            onChange={hadleChangeLogin}
          />
          <br />
          <label htmlFor="password">Password</label> <br />
          {passwordError != "" ? (
            <>
              <span className="error-message-register">{passwordError}</span>{" "}
              <br />
            </>
          ) : (
            <></>
          )}
          <input
            type="password"
            placeholder="Password"
            required
            onChange={hadleChangePassword}
          />
          <br />
        </div>
        <button type="submit" className="submit-button">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
