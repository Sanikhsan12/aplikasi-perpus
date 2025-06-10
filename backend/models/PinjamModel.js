import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import User from "../models/UserModel.js";
import Buku from "../models/BookModel.js";
const { DataTypes } = Sequelize;

const Pinjam = db.define(
  "pinjam",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tanggal_pinjam: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    tanggal_kembali: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    bukuId: {
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
  }
);

// relasi
User.hasMany(Pinjam, { foreignKey: "userId" });
Pinjam.belongsTo(User, { foreignKey: "userId" });

Buku.hasMany(Pinjam, { foreignKey: "bukuId" });
Pinjam.belongsTo(Buku, { foreignKey: "bukuId" });

export default Pinjam;
