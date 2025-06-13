import React, { useState, useEffect } from "react";
import api from "../api";

const AvailableBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/book?limit=100&search=${debouncedSearchTerm}`
        );
        setBooks(response.data.books.filter((book) => book.stok > 0));
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchBooks();
  }, [debouncedSearchTerm]);

  if (loading) return <p>Memuat buku...</p>;
  if (error) return <p>Terjadi kesalahan: {error.message}</p>;

  return (
    <div className="box">
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
              <div className="card">
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
              </div>
            </div>
          ))
        ) : (
          <p>Tidak ada buku yang tersedia.</p>
        )}
      </div>
    </div>
  );
};

export default AvailableBooks;
