// backend/controllers/PengembalianController.js
import Pengembalian from "../models/PengembalianModel.js";
import User from "../models/UserModel.js";
import Pinjam from "../models/PinjamModel.js";
import Buku from "../models/BookModel.js";
import db from "../config/Database.js";
import { Op } from "sequelize";

export const getPengembalians = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    const where = {
      [Op.or]: [
        { "$user.username$": { [Op.like]: `%${search}%` } },
        { "$buku.judul$": { [Op.like]: `%${search}%` } },
        { "$pinjam.id$": { [Op.like]: `%${search}%` } },
      ],
    };

    const { count, rows } = await Pengembalian.findAndCountAll({
      include: [
        { model: Pinjam, as: "pinjam" },
        { model: Buku, as: "buku" },
        { model: User, as: "user" },
      ],
      where: search ? where : {},
      limit: limit,
      offset: offset,
      order: [["tanggal_pengembalian", "DESC"]],
    });
    res.json({
      totalItems: count,
      pengembalians: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPengembalianById = async (req, res) => {
  try {
    const pengembalian = await Pengembalian.findByPk(req.params.id, {
      include: [
        { model: Pinjam, as: "pinjam" },
        { model: Buku, as: "buku" },
        { model: User, as: "user" },
      ],
    });
    if (pengembalian) {
      res.json(pengembalian);
    } else {
      res.status(404).json({ message: "Catatan pengembalian tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPengembalian = async (req, res) => {
  const { pinjamId, kondisi_buku, denda } = req.body;
  const t = await db.transaction();

  try {
    const pinjam = await Pinjam.findByPk(pinjamId, { transaction: t });
    if (!pinjam) {
      await t.rollback();
      return res
        .status(404)
        .json({ message: "Catatan peminjaman tidak ditemukan" });
    }

    if (pinjam.status === "dikembalikan") {
      await t.rollback();
      return res.status(400).json({ message: "Buku ini sudah dikembalikan." });
    }

    await Buku.increment("stok", {
      by: 1,
      where: { id: pinjam.bukuId },
      transaction: t,
    });

    const newPengembalian = await Pengembalian.create(
      {
        pinjamId,
        userId: pinjam.userId,
        bukuId: pinjam.bukuId,
        tanggal_pengembalian: new Date(),
        kondisi_buku,
        denda: denda || 0,
      },
      { transaction: t }
    );

    await Pinjam.update(
      { status: "dikembalikan" },
      { where: { id: pinjamId }, transaction: t }
    );

    await t.commit();
    res.status(201).json(newPengembalian);
  } catch (error) {
    await t.rollback();
    console.error("Error creating pengembalian:", error);
    res.status(400).json({ message: error.message });
  }
};
