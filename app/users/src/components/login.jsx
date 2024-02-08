import React, { useEffect, useState } from "react";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token") != undefined) {
      window.location.href = "/dashboard";
      return;
    }
  }, []);

  const submitForm = () => {
    if (localStorage.getItem("token") != undefined) return;

    axios
      .post("http://localhost:3000/login", { name: username })
      .then((response) => {
        const token = response.data.token;
        if (token) {
          localStorage.setItem("token", token);
          window.location.href = "/dashboard";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <h1 style={{}}>Your personalized grocery list</h1>
      <input
        style={{ height: "30px", fontSize: "20px" }}
        onChange={(e) => setUsername(e.target.value)}
      />
      <h2 style={{ fontSize: "20px" }}>
        <button onClick={submitForm}>Sign in</button>
      </h2>
    </div>
  );
};

export default Login;
