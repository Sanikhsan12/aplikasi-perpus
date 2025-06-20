// backend/controllers/PinjamController.js
import { Op } from "sequelize";
import Pinjam from "../models/PinjamModel.js";
import Buku from "../models/BookModel.js";
import db from "../config/Database.js";
import User from "../models/UserModel.js";
import Pengembalian from "../models/PengembalianModel.js";

export const getPinjams = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    let where = {
      status: "dipinjam",
    };

    if (search) {
      where[Op.and] = [
        { status: "dipinjam" },
        {
          [Op.or]: [
            { "$user.username$": { [Op.like]: `%${search}%` } },
            { "$buku.judul$": { [Op.like]: `%${search}%` } },
          ],
        },
      ];
    }

    const { count, rows } = await Pinjam.findAndCountAll({
      include: [
        { model: User, as: "user", attributes: ["username"] },
        { model: Buku, as: "buku", attributes: ["judul"] },
      ],
      where: where,
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
    const pinjam = await Pinjam.findByPk(req.params.id, {
      include: [
        { model: User, as: "user" },
        { model: Buku, as: "buku" },
      ],
    });
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
  const t = await db.transaction();

  try {
    const book = await Buku.findByPk(bukuId, { transaction: t });
    if (!book) {
      await t.rollback();
      return res.status(404).json({ message: "Buku tidak ditemukan" });
    }
    if (book.stok <= 0) {
      await t.rollback();
      return res.status(400).json({ message: "Stok buku tidak tersedia" });
    }

    await Buku.update(
      { stok: book.stok - 1 },
      { where: { id: bukuId }, transaction: t }
    );

    const newPinjam = await Pinjam.create(
      {
        tanggal_pinjam,
        tanggal_kembali,
        userId,
        bukuId,
        status: "dipinjam", // Tambahkan ini
      },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json(newPinjam);
  } catch (error) {
    await t.rollback();
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
  const { id } = req.params;
  const t = await db.transaction();
  try {
    const pinjam = await Pinjam.findByPk(id, { transaction: t });
    if (!pinjam) {
      await t.rollback();
      return res
        .status(404)
        .json({ message: "Catatan peminjaman tidak ditemukan." });
    }

    // Kembalikan stok buku
    await Buku.increment("stok", {
      by: 1,
      where: { id: pinjam.bukuId },
      transaction: t,
    });

    const deleted = await Pinjam.destroy({
      where: { id: id },
      transaction: t,
    });

    if (deleted) {
      await t.commit();
      res.status(204).send();
    } else {
      await t.rollback();
      res.status(404).json({ message: "Pinjam not found" });
    }
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
};
