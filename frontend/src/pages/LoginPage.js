import React, { useState } from "react";
import axios from "axios"; // Keep axios for direct login call
import { useNavigate } from "react-router-dom";
import "bulma/css/bulma.min.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const Auth = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email: email,
        password: password,
      });
      localStorage.setItem("token", response.data.token); // Store the token
      navigate("/adminDashboard");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.message);
      }
    }
  };

  return (
    <section
      className="hero is-fullheight is-bold"
      style={{
        backgroundImage: `url('${process.env.PUBLIC_URL}/AuthPage.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-4">
              <form onSubmit={Auth} className="box has-background-warning-dark">
                <p className="has-text-centered has-text-danger">{msg}</p>
                <h1 className="title is-4 has-text-centered">
                  Login Dulu Yah..
                  <img
                    src={`${process.env.PUBLIC_URL}/Thinking.gif`}
                    alt="Thingking Emoji"
                    style={{
                      width: "30px",
                      height: "30px",
                      verticalAlign: "middle",
                      marginLeft: "5px",
                    }}
                  />
                </h1>
                <div className="field">
                  <label className="label">Email</label>
                  <div className="control">
                    <input
                      type="text"
                      className="input"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Password</label>
                  <div className="control">
                    <input
                      type="password"
                      className="input"
                      placeholder="******"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="field">
                  <p className="control">
                    <a
                      href="/register"
                      className="has-text-white has-text-centered"
                    >
                      Belum punya akun? Daftar sekarang!
                    </a>
                  </p>
                </div>
                <div className="field mt-5">
                  <button
                    type="submit"
                    className="button is-primary is-fullwidth has-background-danger-dark has-text-white"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
