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
  useEffect(() => {
    const fetchPengembalian = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/pengembalian?page=${currentPage}&limit=10`
        );
        setPengembalian(response.data.pengembalian);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
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
