import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Pinjam from "../models/PinjamModel.js";
import Buku from "../models/BookModel.js";
import User from "../models/UserModel.js";
const { DataTypes } = Sequelize;

const Pengembalian = db.define(
  "pengembalian",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tanggal_pengembalian: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Set default to current timestamp
    },
    kondisi_buku: {
      type: DataTypes.STRING, // Misalnya: "baik", "rusak ringan", "rusak berat"
      allowNull: true, // Bisa diisi atau tidak
    },
    denda: {
      type: DataTypes.DECIMAL(10, 2), // Untuk mencatat denda jika ada
      allowNull: true,
      defaultValue: 0.0,
    },
    pinjamId: {
      // Foreign key ke tabel peminjaman
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Pastikan satu peminjaman hanya bisa dikembalikan sekali
      references: {
        model: Pinjam,
        key: "id",
      },
    },
    userId: {
      // Foreign key ke user yang mengembalikan (bisa saja berbeda dengan user yang meminjam)
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    bukuId: {
      // Foreign key ke buku yang dikembalikan
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Buku,
        key: "id",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false, // Jika tanggal_pengembalian sudah cukup, timestamps Sequelize bisa dimatikan
  }
);

// Definisi relasi
Pengembalian.belongsTo(Pinjam, { foreignKey: "pinjamId" });
Pinjam.hasOne(Pengembalian, { foreignKey: "pinjamId" }); // Satu peminjaman memiliki satu pengembalian

Pengembalian.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Pengembalian, { foreignKey: "userId" });

Pengembalian.belongsTo(Buku, { foreignKey: "bukuId" });
Buku.hasMany(Pengembalian, { foreignKey: "bukuId" });

export default Pengembalian;
