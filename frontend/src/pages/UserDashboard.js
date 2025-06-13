import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { jwtDecode } from "jwt-decode";
import AvailableBooks from "../components/AvailableBooks";
import BorrowingHistory from "../components/BorrowingHistory";
import BorrowBook from "../components/BorrowBook";

const UserDashboard = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUsername(decoded.username);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const Logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <nav
        className="navbar is-info"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <a className="navbar-item" href="/userDashboard">
            <h1 className="title is-4 has-text-white">User Dashboard</h1>
          </a>
        </div>

        <div className="navbar-menu">
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
          <div className="columns is-multiline">
            <div className="column is-full">
              <BorrowBook />
            </div>
            <div className="column is-full">
              <AvailableBooks />
            </div>
            <div className="column is-full">
              <BorrowingHistory />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
