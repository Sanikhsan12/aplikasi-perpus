// frontend/src/components/BooksTable.js
import React, { useState, useEffect } from "react";
import api from "../api";
import Table from "./Table";
import ActionModal from "./ActionModal";

const BooksTable = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [currentBook, setCurrentBook] = useState({
    judul: "",
    penulis: "",
    penerbit: "",
    tahun_terbit: "",
    stok: "",
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

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/book?page=${currentPage}&limit=10&search=${debouncedSearchTerm}`
      );
      setBooks(response.data.books);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage === 1) {
      fetchBooks();
    } else {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

  const handleOpenModal = (type, book = null) => {
    setModalType(type);
    if (type === "edit" && book) {
      setCurrentBook(book);
    } else {
      setCurrentBook({
        judul: "",
        penulis: "",
        penerbit: "",
        tahun_terbit: "",
        stok: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentBook({
      judul: "",
      penulis: "",
      penerbit: "",
      tahun_terbit: "",
      stok: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBook({ ...currentBook, [name]: value });
  };

  const handleSave = async () => {
    try {
      if (modalType === "add") {
        await api.post("/book", currentBook);
      } else {
        await api.patch(`/book/${currentBook.id}`, currentBook);
      }
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchBooks();
      }
      handleCloseModal();
    } catch (error) {
      console.error("Gagal menyimpan buku:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
      try {
        await api.delete(`/book/${id}`);
        fetchBooks();
      } catch (error) {
        console.error("Gagal menghapus buku:", error);
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
    { header: "Judul", accessor: "judul" },
    { header: "Penulis", accessor: "penulis" },
    { header: "Penerbit", accessor: "penerbit" },
    { header: "Tahun Terbit", accessor: "tahun_terbit" },
    { header: "Stok", accessor: "stok" },
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
            className="button is-small is-danger"
            onClick={() => handleDelete(row.id)}
          >
            Hapus
          </button>
        </>
      ),
    },
  ];

  if (loading) return <p>Memuat buku...</p>;
  if (error) return <p>Terjadi kesalahan: {error.message}</p>;

  return (
    <div className="box">
      <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
        <h2 className="title is-4">Daftar Buku</h2>
        <div className="field has-addons">
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="Cari buku..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="control">
            <button
              className="button is-primary ml-2"
              onClick={() => handleOpenModal("add")}
            >
              Tambah Buku
            </button>
          </div>
        </div>
      </div>
      <Table
        data={books}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
      />

      <ActionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalType === "add" ? "Tambah Buku Baru" : "Edit Buku"}
        onSave={handleSave}
      >
        <div className="field">
          <label className="label">Judul</label>
          <div className="control">
            <input
              className="input"
              type="text"
              name="judul"
              value={currentBook.judul}
              onChange={handleInputChange}
              placeholder="Judul Buku"
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Penulis</label>
          <div className="control">
            <input
              className="input"
              type="text"
              name="penulis"
              value={currentBook.penulis}
              onChange={handleInputChange}
              placeholder="Penulis Buku"
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Penerbit</label>
          <div className="control">
            <input
              className="input"
              type="text"
              name="penerbit"
              value={currentBook.penerbit}
              onChange={handleInputChange}
              placeholder="Penerbit Buku"
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Tahun Terbit</label>
          <div className="control">
            <input
              className="input"
              type="number"
              name="tahun_terbit"
              value={currentBook.tahun_terbit}
              onChange={handleInputChange}
              placeholder="Tahun Terbit"
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Stok</label>
          <div className="control">
            <input
              className="input"
              type="number"
              name="stok"
              value={currentBook.stok}
              onChange={handleInputChange}
              placeholder="Jumlah Stok"
            />
          </div>
        </div>
      </ActionModal>
    </div>
  );
};

export default BooksTable;
