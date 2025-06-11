// frontend/src/components/UsersTable.js
import React, { useState, useEffect } from "react";
import api from "../api"; // Import the configured axios instance
import Table from "./Table";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/user"); // Use 'api' instead of 'axios'
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Username", accessor: "username" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
    {
      header: "Aksi",
      render: (row) => (
        <>
          <button className="button is-small is-info mr-2">Edit</button>
          <button className="button is-small is-danger">Hapus</button>
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
    </div>
  );
};

export default UsersTable;
