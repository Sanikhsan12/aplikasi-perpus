import React, { useState } from "react";
import api from "../api";
import { jwtDecode } from "jwt-decode";

const BorrowBook = () => {
  const [bukuId, setBukuId] = useState("");
  const [tanggalKembali, setTanggalKembali] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleBorrow = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      const response = await api.post("/pinjam", {
        bukuId: parseInt(bukuId, 10),
        userId: userId,
        tanggal_pinjam: new Date().toISOString().split("T")[0],
        tanggal_kembali: tanggalKembali,
      });

      setMessage("Buku berhasil dipinjam!");
      setBukuId("");
      setTanggalKembali("");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal meminjam buku.");
    }
  };

  return (
    <div className="box">
      <h2 className="title is-4">Pinjam Buku</h2>
      {message && <div className="notification is-success">{message}</div>}
      {error && <div className="notification is-danger">{error}</div>}
      <form onSubmit={handleBorrow}>
        <div className="field">
          <label className="label">ID Buku</label>
          <div className="control">
            <input
              className="input"
              type="number"
              placeholder="Masukkan ID Buku"
              value={bukuId}
              onChange={(e) => setBukuId(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Tanggal Kembali</label>
          <div className="control">
            <input
              className="input"
              type="date"
              value={tanggalKembali}
              onChange={(e) => setTanggalKembali(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="control">
          <button type="submit" className="button is-primary">
            Pinjam
          </button>
        </div>
      </form>
    </div>
  );
};

export default BorrowBook;
