// frontend/src/components/AvailableBooks.js
import React, { useState, useEffect } from "react";
import api from "../api";
import { jwtDecode } from "jwt-decode";
import ActionModal from "./ActionModal";

const AvailableBooks = ({ onBorrowSuccess }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // State untuk Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [tanggalKembali, setTanggalKembali] = useState("");
  const [borrowMessage, setBorrowMessage] = useState("");
  const [borrowError, setBorrowError] = useState("");

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/book?page=${currentPage}&limit=8&search=${debouncedSearchTerm}`
      );
      setBooks(response.data.books.filter((book) => book.stok > 0));
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    // Kembali ke halaman 1 setiap kali ada pencarian baru
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchBooks();
  }, [debouncedSearchTerm, currentPage]);

  const handleOpenModal = (book) => {
    setSelectedBook(book);
    setBorrowMessage("");
    setBorrowError("");
    setTanggalKembali("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const handleConfirmBorrow = async () => {
    if (!selectedBook || !tanggalKembali) {
      setBorrowError("Tanggal kembali harus diisi.");
      return;
    }

    setBorrowMessage("");
    setBorrowError("");

    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      await api.post("/pinjam", {
        bukuId: selectedBook.id,
        userId: userId,
        tanggal_pinjam: new Date().toISOString().split("T")[0],
        tanggal_kembali: tanggalKembali,
      });

      setBorrowMessage("Buku berhasil dipinjam!");

      setTimeout(() => {
        handleCloseModal();
        fetchBooks();
        if (onBorrowSuccess) {
          onBorrowSuccess();
        }
      }, 1500);
    } catch (err) {
      setBorrowError(err.response?.data?.message || "Gagal meminjam buku.");
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  if (loading) return <p>Memuat buku...</p>;
  if (error) return <p>Terjadi kesalahan: {error.message}</p>;

  return (
    <div className="box has-background-warning-dark has-text-white">
      <h2 className="title is-4">Buku yang Tersedia</h2>
      <div className="field">
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Cari buku..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="columns is-multiline">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.id} className="column is-one-quarter">
              <div className="card has-background-warning-dark">
                <div className="card-content">
                  <p className="title is-5">{book.judul}</p>
                  <p className="subtitle is-6">oleh {book.penulis}</p>
                  <div className="content">
                    <p>
                      <strong>Penerbit:</strong> {book.penerbit}
                    </p>
                    <p>
                      <strong>Tahun Terbit:</strong> {book.tahun_terbit}
                    </p>
                    <p>
                      <strong>Stok:</strong> {book.stok}
                    </p>
                  </div>
                </div>
                <footer className="card-footer">
                  <a
                    href="#"
                    className="card-footer-item has-background-warning-dark has-text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      handleOpenModal(book);
                    }}
                  >
                    Pinjam
                  </a>
                </footer>
              </div>
            </div>
          ))
        ) : (
          <div className="column">
            <p>
              Tidak ada buku yang tersedia atau cocok dengan pencarian Anda.
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <nav
          className="pagination is-centered mt-5"
          role="navigation"
          aria-label="pagination"
        >
          <button
            className="pagination-previous"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Sebelumnya
          </button>
          <button
            className="pagination-next"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Selanjutnya
          </button>
          <ul className="pagination-list">
            <li>
              <span
                className="pagination-link is-current has-background-danger-dark has-text-white"
                aria-label={`Halaman ${currentPage}`}
                aria-current="page"
              >
                Halaman {currentPage} dari {totalPages}
              </span>
            </li>
          </ul>
        </nav>
      )}

      {selectedBook && (
        <ActionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleConfirmBorrow}
          title={`Pinjam Buku: ${selectedBook.judul}`}
          saveButtonText="Konfirmasi Pinjam"
        >
          {borrowMessage && (
            <div className="notification is-success">{borrowMessage}</div>
          )}
          {borrowError && (
            <div className="notification is-danger">{borrowError}</div>
          )}
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
        </ActionModal>
      )}
    </div>
  );
};

export default AvailableBooks;
