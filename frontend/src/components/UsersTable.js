// frontend/src/components/UsersTable.js
import React, { useState, useEffect } from "react";
import api from "../api";
import Table from "./Table";
import ActionModal from "./ActionModal";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType] = useState("add");
  const [currentUser, setCurrentUser] = useState({
    username: "",
    email: "",
    role: "user",
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

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/user?page=${currentPage}&limit=10&search=${debouncedSearchTerm}`
      );
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage === 1) {
      fetchUsers();
    } else {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const handleOpenModal = (user) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUser({ username: "", email: "", role: "user" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  const handleSave = async () => {
    try {
      if (modalType === "add") {
        await api.post("/user", currentUser);
      } else {
        await api.patch(`/user/${currentUser.id}`, currentUser);
      }
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchUsers();
      }
      handleCloseModal();
    } catch (error) {
      console.error("Gagal memperbarui pengguna:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      try {
        await api.delete(`/user/${id}`);
        fetchUsers();
      } catch (error) {
        console.error("Gagal menghapus pengguna:", error);
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
    { header: "Username", accessor: "username" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
    {
      header: "Aksi",
      render: (row) => (
        <>
          <button
            className="button is-small is-info mr-2"
            onClick={() => handleOpenModal(row)}
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

  if (loading) return <p>Memuat pengguna...</p>;
  if (error) return <p>Terjadi kesalahan: {error.message}</p>;

  return (
    <div className="box">
      <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
        <h2 className="title is-4">Daftar Pengguna</h2>
        <div className="field">
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="Cari pengguna..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <Table
        data={users}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
      />

      <ActionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Edit Pengguna"
        onSave={handleSave}
      >
        <div className="field">
          <label className="label">Username</label>
          <div className="control">
            <input
              className="input"
              type="text"
              name="username"
              value={currentUser.username}
              onChange={handleInputChange}
              placeholder="Username"
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Email</label>
          <div className="control">
            <input
              className="input"
              type="email"
              name="email"
              value={currentUser.email}
              onChange={handleInputChange}
              placeholder="Email"
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Role</label>
          <div className="control">
            <div className="select">
              <select
                name="role"
                value={currentUser.role}
                onChange={handleInputChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>
      </ActionModal>
    </div>
  );
};

export default UsersTable;
