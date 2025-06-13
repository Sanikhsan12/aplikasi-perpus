// frontend/src/components/PengembalianTable.js
import React, { useState, useEffect, useMemo } from "react";
import api from "../api";
import Table from "./Table";

const PengembalianTable = () => {
  const [pengembalian, setPengembalian] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // State untuk pencarian

  useEffect(() => {
    const fetchPengembalian = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/pengembalian?page=${currentPage}&limit=10`
        );
        setPengembalian(response.data.pengembalians); // <-- Disesuaikan dengan response API
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchPengembalian();
  }, [currentPage]);

  // Filter data pengembalian berdasarkan searchTerm
  const filteredPengembalian = useMemo(() => {
    if (!searchTerm) {
      return pengembalian;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return pengembalian.filter(
      (item) =>
        String(item.id).includes(lowercasedSearchTerm) ||
        String(item.pinjamId).includes(lowercasedSearchTerm) ||
        String(item.userId).includes(lowercasedSearchTerm) ||
        String(item.bukuId).includes(lowercasedSearchTerm) ||
        (item.kondisi_buku &&
          item.kondisi_buku.toLowerCase().includes(lowercasedSearchTerm))
    );
  }, [pengembalian, searchTerm]);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "ID Peminjaman", accessor: "pinjamId" },
    { header: "ID User", accessor: "userId" },
    { header: "ID Buku", accessor: "bukuId" },
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
        data={filteredPengembalian}
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
