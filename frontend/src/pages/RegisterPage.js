import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bulma/css/bulma.min.css";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const Auth = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/register", {
        username: username,
        email: email,
        password: password,
      });
      navigate("/login");
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
              <form className="box has-background-warning-dark" onSubmit={Auth}>
                <p className="has-text-centered has-text-danger">{msg}</p>
                <h1 className="title is-4 has-text-centered">
                  Daftar Dulu geys
                  <img
                    src={`${process.env.PUBLIC_URL}/Thinking.gif`}
                    alt="Thinking Emoji"
                    style={{
                      width: "30px",
                      height: "30px",
                      verticalAlign: "middle",
                      marginLeft: "5px",
                    }}
                  />
                </h1>
                <div className="field">
                  <label className="label">Username</label>
                  <div className="control">
                    <input
                      type="text"
                      className="input"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Email</label>
                  <div className="control">
                    <input
                      type="email"
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
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="field">
                  <p className="control">
                    <a
                      href="/login"
                      className="has-text-white has-text-centered"
                    >
                      Sudah Punya Akun? Login sekarang!
                    </a>
                  </p>
                </div>
                <button
                  type="submit"
                  className="button is-primary is-fullwidth has-text-white has-background-danger-dark mt-5"
                >
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
