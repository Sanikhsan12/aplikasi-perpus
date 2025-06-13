// frontend/src/components/PeminjamanTable.js
import React, { useState, useEffect } from "react";
import api from "../api";
import Table from "./Table";
import ActionModal from "./ActionModal";

const PeminjamanTable = () => {
  const [peminjaman, setPeminjaman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [currentPeminjaman, setCurrentPeminjaman] = useState({
    tanggal_pinjam: "",
    tanggal_kembali: "",
    userId: "",
    bukuId: "",
  });
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

  const fetchPeminjaman = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/pinjam?page=${currentPage}&limit=10&search=${debouncedSearchTerm}`
      );
      setPeminjaman(response.data.pinjams);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage === 1) {
      fetchPeminjaman();
    } else {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchPeminjaman();
  }, [currentPage]);

  const handleOpenModal = (type, peminjamanData = null) => {
    setModalType(type);
    if (type === "edit" && peminjamanData) {
      const formattedPinjam = {
        ...peminjamanData,
        tanggal_pinjam: new Date(peminjamanData.tanggal_pinjam)
          .toISOString()
          .split("T")[0],
        tanggal_kembali: new Date(peminjamanData.tanggal_kembali)
          .toISOString()
          .split("T")[0],
      };
      setCurrentPeminjaman(formattedPinjam);
    } else {
      setCurrentPeminjaman({
        tanggal_pinjam: "",
        tanggal_kembali: "",
        userId: "",
        bukuId: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPeminjaman({
      tanggal_pinjam: "",
      tanggal_kembali: "",
      userId: "",
      bukuId: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPeminjaman({ ...currentPeminjaman, [name]: value });
  };

  const handleSave = async () => {
    try {
      if (modalType === "add") {
        await api.post("/pinjam", currentPeminjaman);
      } else {
        await api.patch(`/pinjam/${currentPeminjaman.id}`, currentPeminjaman);
      }
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchPeminjaman();
      }
      handleCloseModal();
    } catch (error) {
      console.error("Gagal menyimpan data peminjaman:", error);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Apakah Anda yakin ingin menghapus data peminjaman ini?")
    ) {
      try {
        await api.delete(`/pinjam/${id}`);
        fetchPeminjaman();
      } catch (error) {
        console.error("Gagal menghapus data peminjaman:", error);
      }
    }
  };

  const handleReturn = async (id) => {
    if (window.confirm("Apakah Anda yakin buku ini telah dikembalikan?")) {
      try {
        await api.patch(`/pinjam/${id}/return`);
        fetchPeminjaman();
      } catch (error) {
        console.error("Gagal memproses pengembalian:", error);
      }
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Tanggal Pinjam", accessor: "tanggal_pinjam" },
    { header: "Tanggal Kembali", accessor: "tanggal_kembali" },
    { header: "Username", accessor: "user.username" },
    { header: "Judul Buku", accessor: "buku.judul" },
    {
      header: "Aksi",
      render: (row) => (
        <>
          <button
            className="button is-small is-info mr-2"
            onClick={() => handleOpenModal("edit", row)}
          >
            Edit
          </button>
          <button
            className="button is-small is-danger mr-2"
            onClick={() => handleDelete(row.id)}
          >
            Hapus
          </button>
          <button
            className="button is-small is-success"
            onClick={() => handleReturn(row.id)}
          >
            Kembalikan
          </button>
        </>
      ),
    },
  ];

  if (loading) return <p>Memuat data peminjaman...</p>;
  if (error) return <p>Terjadi kesalahan: {error.message}</p>;

  return (
    <div className="box">
      <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
        <h2 className="title is-4">Daftar Peminjaman</h2>
        <div className="field has-addons">
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="Cari Username/Judul Buku..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="control">
            <button
              className="button is-primary ml-2"
              onClick={() => handleOpenModal("add")}
            >
              Tambah Peminjaman
            </button>
          </div>
        </div>
      </div>
      <Table
        data={peminjaman}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
      />

      <ActionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalType === "add" ? "Tambah Peminjaman" : "Edit Peminjaman"}
        onSave={handleSave}
      >
        <div className="field">
          <label className="label">Tanggal Pinjam</label>
          <div className="control">
            <input
              className="input"
              type="date"
              name="tanggal_pinjam"
              value={currentPeminjaman.tanggal_pinjam}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Tanggal Kembali</label>
          <div className="control">
            <input
              className="input"
              type="date"
              name="tanggal_kembali"
              value={currentPeminjaman.tanggal_kembali}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="field">
          <label className="label">ID User</label>
          <div className="control">
            <input
              className="input"
              type="number"
              name="userId"
              value={currentPeminjaman.userId}
              onChange={handleInputChange}
              placeholder="ID Pengguna"
            />
          </div>
        </div>
        <div className="field">
          <label className="label">ID Buku</label>
          <div className="control">
            <input
              className="input"
              type="number"
              name="bukuId"
              value={currentPeminjaman.bukuId}
              onChange={handleInputChange}
              placeholder="ID Buku"
            />
          </div>
        </div>
      </ActionModal>
    </div>
  );
};

export default PeminjamanTable;
