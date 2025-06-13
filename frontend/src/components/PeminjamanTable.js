// frontend/src/components/PeminjamanTable.js
import React, { useState, useEffect } from "react";
import api from "../api";
import Table from "./Table";
import ActionModal from "./ActionModal";

const PeminjamanTable = () => {
  const [peminjaman, setPeminjaman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [currentPeminjaman, setCurrentPeminjaman] = useState(null);
  const [returnDetails, setReturnDetails] = useState({
    kondisi_buku: "baik",
    denda: 0,
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

  const handleOpenEditModal = (peminjamanData) => {
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
    setIsEditModalOpen(true);
  };

  const handleOpenReturnModal = (peminjamanData) => {
    setCurrentPeminjaman(peminjamanData);
    setIsReturnModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setIsReturnModalOpen(false);
    setCurrentPeminjaman(null);
    setReturnDetails({ kondisi_buku: "baik", denda: 0 });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPeminjaman({ ...currentPeminjaman, [name]: value });
  };

  const handleReturnInputChange = (e) => {
    const { name, value } = e.target;
    setReturnDetails({ ...returnDetails, [name]: value });
  };

  const handleSave = async () => {
    try {
      await api.patch(`/pinjam/${currentPeminjaman.id}`, currentPeminjaman);
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
      window.confirm(
        "Apakah Anda yakin ingin menghapus data peminjaman ini? Ini akan mengembalikan stok buku."
      )
    ) {
      try {
        await api.delete(`/pinjam/${id}`);
        fetchPeminjaman();
      } catch (error) {
        console.error("Gagal menghapus data peminjaman:", error);
      }
    }
  };

  const handleConfirmReturn = async () => {
    if (!currentPeminjaman) return;
    try {
      await api.post("/pengembalian", {
        pinjamId: currentPeminjaman.id,
        kondisi_buku: returnDetails.kondisi_buku,
        denda: returnDetails.denda,
      });
      fetchPeminjaman();
      handleCloseModal();
    } catch (error) {
      console.error("Gagal memproses pengembalian:", error);
      alert(error.response?.data?.message || "Terjadi kesalahan");
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
    {
      header: "Tanggal Pinjam",
      accessor: "tanggal_pinjam",
      render: (row) => new Date(row.tanggal_pinjam).toLocaleDateString("id-ID"),
    },
    {
      header: "Tanggal Kembali",
      accessor: "tanggal_kembali",
      render: (row) =>
        new Date(row.tanggal_kembali).toLocaleDateString("id-ID"),
    },
    { header: "Username", accessor: (row) => row.user?.username || "N/A" },
    { header: "Judul Buku", accessor: (row) => row.buku?.judul || "N/A" },
    {
      header: "Aksi",
      render: (row) => (
        <>
          <button
            className="button is-small is-info mr-2"
            onClick={() => handleOpenEditModal(row)}
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
            onClick={() => handleOpenReturnModal(row)}
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

      {/* Edit Modal */}
      {currentPeminjaman && (
        <ActionModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          title="Edit Peminjaman"
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
        </ActionModal>
      )}

      {/* Return Modal */}
      {currentPeminjaman && (
        <ActionModal
          isOpen={isReturnModalOpen}
          onClose={handleCloseModal}
          title="Konfirmasi Pengembalian"
          onSave={handleConfirmReturn}
          saveButtonText="Konfirmasi"
        >
          <p>
            Anda akan mengembalikan buku{" "}
            <strong>{currentPeminjaman.buku?.judul}</strong> yang dipinjam oleh{" "}
            <strong>{currentPeminjaman.user?.username}</strong>.
          </p>
          <div className="field mt-4">
            <label className="label">Kondisi Buku</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  name="kondisi_buku"
                  value={returnDetails.kondisi_buku}
                  onChange={handleReturnInputChange}
                >
                  <option value="baik">Baik</option>
                  <option value="rusak ringan">Rusak Ringan</option>
                  <option value="rusak berat">Rusak Berat</option>
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">Denda (jika ada)</label>
            <div className="control">
              <input
                className="input"
                type="number"
                name="denda"
                value={returnDetails.denda}
                onChange={handleReturnInputChange}
                placeholder="Jumlah Denda"
              />
            </div>
          </div>
        </ActionModal>
      )}
    </div>
  );
};

export default PeminjamanTable;
