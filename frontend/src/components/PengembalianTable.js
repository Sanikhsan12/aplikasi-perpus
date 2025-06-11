// frontend/src/components/PengembalianTable.js
import React, { useState, useEffect } from "react";
import api from "../api"; // Import the configured axios instance
import Table from "./Table";

const PengembalianTable = () => {
  const [pengembalian, setPengembalian] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPengembalian = async () => {
      try {
        const response = await api.get("/pengembalian"); // Use 'api' instead of 'axios'
        setPengembalian(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchPengembalian();
  }, []);

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "ID Peminjaman", accessor: "pinjamId" },
    { header: "ID User", accessor: "userId" },
    { header: "ID Buku", accessor: "bukuId" },
    { header: "Tanggal Pengembalian", accessor: "tanggal_pengembalian" },
    { header: "Kondisi Buku", accessor: "kondisi_buku" },
    { header: "Denda", accessor: "denda" },
    {
      header: "Aksi",
      render: (row) => (
        <>
          <button className="button is-small is-info mr-2">Detail</button>
          {/* Tambahkan aksi lain jika diperlukan */}
        </>
      ),
    },
  ];

  if (loading) return <p>Memuat data pengembalian...</p>;
  if (error) return <p>Terjadi kesalahan: {error.message}</p>;

  return (
    <div className="box">
      <h2 className="title is-4">Daftar Pengembalian</h2>
      <Table data={pengembalian} columns={columns} />
    </div>
  );
};

export default PengembalianTable;
