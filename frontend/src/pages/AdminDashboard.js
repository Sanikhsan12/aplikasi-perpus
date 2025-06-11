// frontend/src/pages/AdminDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import UsersTable from "../components/UsersTable";
import BooksTable from "../components/BooksTable";
import PeminjamanTable from "../components/PeminjamanTable";
import PengembalianTable from "../components/PengembalianTable";
import "../style/App.css"; // Ensure this is imported for custom styles

const AdminDashboard = () => {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.post("http://localhost:5000/token", {
        token: localStorage.getItem("token"), // Assuming token is stored in localStorage
      });
      setToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setUsername(decoded.username);
      setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        navigate("/login");
      }
    }
  };

  const Logout = () => {
    localStorage.removeItem("token"); // Clear token on logout
    navigate("/login");
  };

  return (
    <div>
      <nav
        className="navbar is-warning-dark"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <a className="navbar-item" href="/dashboard">
            <h1 className="title is-4 has-text-white">Admin Dashboard</h1>
          </a>
          <a
            role="button"
            className="navbar-burger burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
            onClick={() => {
              const navbarMenu = document.getElementById("navbarBasicExample");
              navbarMenu.classList.toggle("is-active");
            }}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            <a className="navbar-item has-text-white" href="/dashboard">
              Home
            </a>
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <p className="has-text-white mr-3">Hello, {username}</p>
              <div className="buttons">
                <button onClick={Logout} className="button is-light">
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <section className="section">
        <div className="container">
          <h1 className="title">Dashboard Overview</h1>

          <div className="columns is-multiline">
            <div className="column is-full">
              <UsersTable />
            </div>
            <div className="column is-full">
              <BooksTable />
            </div>
            <div className="column is-full">
              <PeminjamanTable />
            </div>
            <div className="column is-full">
              <PengembalianTable />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
