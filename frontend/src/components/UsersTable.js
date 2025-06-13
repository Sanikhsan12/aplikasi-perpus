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
  const [currentUser, setCurrentUser] = useState({
    username: "",
    email: "",
    role: "user",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/user");
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
      // Hanya kirim field yang bisa diubah
      const { id, username, email, role } = currentUser;
      await api.patch(`/user/${id}`, { username, email, role });
      fetchUsers();
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
      <h2 className="title is-4">Daftar Pengguna</h2>
      <Table data={users} columns={columns} />

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
