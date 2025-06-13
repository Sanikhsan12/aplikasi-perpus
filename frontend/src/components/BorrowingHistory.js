import React, { useState, useEffect } from "react";
import api from "../api";
import { jwtDecode } from "jwt-decode";

const BorrowingHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode(token);
          const userId = decoded.userId;
          const response = await api.get(`/pinjam/history/${userId}`);
          setHistory(response.data);
          setLoading(false);
        }
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <p>Memuat riwayat peminjaman...</p>;
  if (error) return <p>Terjadi kesalahan: {error.message}</p>;

  return (
    <div className="box">
      <h2 className="title is-4">Riwayat Peminjaman Anda</h2>
      {history.length > 0 ? (
        history.map((item) => (
          <div key={item.id} className="box">
            <p>
              <strong>Judul Buku:</strong> {item.buku.judul}
            </p>
            <p>
              <strong>Tanggal Pinjam:</strong>{" "}
              {new Date(item.tanggal_pinjam).toLocaleDateString()}
            </p>
            <p>
              <strong>Tanggal Kembali:</strong>{" "}
              {new Date(item.tanggal_kembali).toLocaleDateString()}
            </p>
          </div>
        ))
      ) : (
        <p>Anda belum memiliki riwayat peminjaman.</p>
      )}
    </div>
  );
};

export default BorrowingHistory;
