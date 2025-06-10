import { Sequelize } from "sequelize";
import db from "../config/Database.js";
const { DataTypes } = Sequelize;

const Buku = db.define(
  "buku",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    judul: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    penulis: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    penerbit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tahun_terbit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stok: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Buku;
