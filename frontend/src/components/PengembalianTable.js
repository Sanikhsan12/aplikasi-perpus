// frontend/src/components/PengembalianTable.js
import React, { useState, useEffect } from "react";
import api from "../api";
import Table from "./Table";

const PengembalianTable = () => {
  const [pengembalian, setPengembalian] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const fetchPengembalian = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/pengembalian?page=${currentPage}&limit=10&search=${debouncedSearchTerm}`
      );
      setPengembalian(response.data.pengembalians);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage === 1) {
      fetchPengembalian();
    } else {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchPengembalian();
  }, [currentPage]);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "ID Peminjaman", accessor: "pinjamId" },
    { header: "Username", accessor: "user.username" },
    { header: "Judul Buku", accessor: "buku.judul" },
    { header: "Tanggal Pengembalian", accessor: "tanggal_pengembalian" },
    { header: "Kondisi Buku", accessor: "kondisi_buku" },
    { header: "Denda", accessor: "denda" },
  ];

  if (loading) return <p>Memuat data pengembalian...</p>;
  if (error) return <p>Terjadi kesalahan: {error.message}</p>;

  return (
    <div className="box">
      <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
        <h2 className="title is-4">Daftar Pengembalian</h2>
        <div className="field">
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="Cari data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <Table
        data={pengembalian}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
      />
    </div>
  );
};

export default PengembalianTable;
