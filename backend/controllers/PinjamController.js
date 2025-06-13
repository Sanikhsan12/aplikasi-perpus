// backend/controllers/PinjamController.js
import { Op } from "sequelize";
import Pinjam from "../models/PinjamModel.js";
import Buku from "../models/BookModel.js";
import db from "../config/Database.js";
import User from "../models/UserModel.js";

export const getPinjams = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    const where = {
      [Op.or]: [
        { "$user.username$": { [Op.like]: `%${search}%` } },
        { "$buku.judul$": { [Op.like]: `%${search}%` } },
      ],
    };

    const { count, rows } = await Pinjam.findAndCountAll({
      include: [
        { model: User, as: "user" },
        { model: Buku, as: "buku" },
      ],
      where: search ? where : {},
      limit: limit,
      offset: offset,
    });
    res.json({
      totalItems: count,
      pinjams: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPinjamById = async (req, res) => {
  try {
    const pinjam = await Pinjam.findByPk(req.params.id);
    if (pinjam) {
      res.json(pinjam);
    } else {
      res.status(404).json({ message: "Pinjam not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPinjamByUserId = async (req, res) => {
  try {
    const pinjams = await Pinjam.findAll({
      where: { userId: req.params.userId },
      include: [
        { model: User, as: "user" },
        { model: Buku, as: "buku" },
      ],
      order: [["tanggal_pinjam", "DESC"]],
    });
    res.json(pinjams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPinjam = async (req, res) => {
  const { tanggal_pinjam, tanggal_kembali, userId, bukuId } = req.body;
  const t = await db.transaction(); // Start a transaction

  try {
    // 1. Cek ketersediaan buku
    const book = await Buku.findByPk(bukuId, { transaction: t });
    if (!book) {
      await t.rollback();
      return res.status(404).json({ message: "Buku tidak ditemukan" });
    }
    if (book.stok <= 0) {
      await t.rollback();
      return res.status(400).json({ message: "Stok buku tidak tersedia" });
    }

    // 2. Kurangi stok buku
    await Buku.update(
      { stok: book.stok - 1 },
      { where: { id: bukuId }, transaction: t }
    );

    // 3. Buat catatan peminjaman
    const newPinjam = await Pinjam.create(
      {
        tanggal_pinjam,
        tanggal_kembali,
        userId,
        bukuId,
      },
      { transaction: t }
    );

    await t.commit(); // Commit the transaction
    res.status(201).json(newPinjam);
  } catch (error) {
    await t.rollback(); // Rollback the transaction if any error occurs
    console.error("Error creating pinjam:", error);
    res.status(400).json({ message: error.message });
  }
};

export const updatePinjam = async (req, res) => {
  try {
    const [updated] = await Pinjam.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedPinjam = await Pinjam.findByPk(req.params.id);
      res.status(200).json(updatedPinjam);
    } else {
      res.status(404).json({ message: "Pinjam not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePinjam = async (req, res) => {
  try {
    const deleted = await Pinjam.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Pinjam not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const returnPinjam = async (req, res) => {
  const { id } = req.params;
  const t = await db.transaction();

  try {
    const pinjam = await Pinjam.findByPk(id, { transaction: t });
    if (!pinjam) {
      await t.rollback();
      return res
        .status(404)
        .json({ message: "Catatan peminjaman tidak ditemukan" });
    }

    const book = await Buku.findByPk(pinjam.bukuId, { transaction: t });
    if (!book) {
      await t.rollback();
      return res.status(404).json({ message: "Buku terkait tidak ditemukan" });
    }
    await Buku.update(
      { stok: book.stok - 1 },
      { where: { id: pinjam.bukuId }, transaction: t }
    );
    await Pinjam.update(
      { tanggal_kembali: new Date() },
      { where: { id: id }, transaction: t }
    );

    await t.commit();
    res
      .status(200)
      .json({ message: "Buku berhasil dikembalikan dan stok diperbarui" });
  } catch (error) {
    await t.rollback();
    console.error("Error returning pinjam:", error);
    res.status(400).json({ message: error.message });
  }
};
