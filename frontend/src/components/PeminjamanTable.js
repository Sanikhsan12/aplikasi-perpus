// frontend/src/components/PeminjamanTable.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "./Table";

const PeminjamanTable = () => {
  const [peminjaman, setPeminjaman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPeminjaman = async () => {
      try {
        const response = await axios.get("http://localhost:5000/pinjam");
        setPeminjaman(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchPeminjaman();
  }, []);

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Tanggal Pinjam", accessor: "tanggal_pinjam" },
    { header: "Tanggal Kembali", accessor: "tanggal_kembali" },
    { header: "ID User", accessor: "userId" },
    { header: "ID Buku", accessor: "bukuId" },
    {
      header: "Aksi",
      render: (row) => (
        <>
          <button className="button is-small is-info mr-2">Edit</button>
          <button className="button is-small is-danger">Hapus</button>
          <button className="button is-small is-success">Kembalikan</button>
        </>
      ),
    },
  ];

  if (loading) return <p>Memuat data peminjaman...</p>;
  if (error) return <p>Terjadi kesalahan: {error.message}</p>;

  return (
    <div className="box">
      <h2 className="title is-4">Daftar Peminjaman</h2>
      <Table data={peminjaman} columns={columns} />
    </div>
  );
};

export default PeminjamanTable;
