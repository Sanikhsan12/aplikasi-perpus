// frontend/src/pages/UserDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import AvailableBooks from "../components/AvailableBooks";
import BorrowingHistory from "../components/BorrowingHistory";

const UserDashboard = () => {
  const [username, setUsername] = useState("");
  const [activeTab, setActiveTab] = useState("borrow");
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username);
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleBorrowSuccess = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const Logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <nav
        className="navbar is-dark"
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
          <div className="tabs is-centered is-boxed">
            <ul>
              <li className={activeTab === "borrow" ? "is-active" : ""}>
                <a onClick={() => setActiveTab("borrow")}>
                  <span>Daftar Buku</span>
                </a>
              </li>
              <li className={activeTab === "history" ? "is-active" : ""}>
                <a onClick={() => setActiveTab("history")}>
                  <span>Riwayat Peminjaman</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="content">
            {activeTab === "borrow" && (
              <AvailableBooks onBorrowSuccess={handleBorrowSuccess} />
            )}
            {activeTab === "history" && <BorrowingHistory key={refreshKey} />}
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
