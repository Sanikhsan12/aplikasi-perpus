// frontend/src/components/BooksTable.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "./Table";

const BooksTable = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/book");
        setBooks(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Judul", accessor: "judul" },
    { header: "Penulis", accessor: "penulis" },
    { header: "Penerbit", accessor: "penerbit" },
    { header: "Tahun Terbit", accessor: "tahun_terbit" },
    { header: "Stok", accessor: "stok" },
    {
      header: "Aksi",
      render: (row) => (
        <>
          <button className="button is-small is-info mr-2">Edit</button>
          <button className="button is-small is-danger">Hapus</button>
        </>
      ),
    },
  ];

  if (loading) return <p>Memuat buku...</p>;
  if (error) return <p>Terjadi kesalahan: {error.message}</p>;

  return (
    <div className="box">
      <h2 className="title is-4">Daftar Buku</h2>
      <Table data={books} columns={columns} />
    </div>
  );
};

export default BooksTable;
