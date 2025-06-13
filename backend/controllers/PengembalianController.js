import Pengembalian from "../models/PengembalianModel.js";
import User from "../models/UserModel.js";
import Pinjam from "../models/PinjamModel.js";
import Buku from "../models/BookModel.js";
import db from "../config/Database.js";

export const getPengembalians = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Pengembalian.findAndCountAll({
      include: [{ model: Pinjam }, { model: Buku }, { model: User }],
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
      include: [{ model: Pinjam }, { model: Buku }, { model: User }],
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
  const { pinjamId, userId, kondisi_buku, denda } = req.body;
  const t = await db.transaction(); // Mulai transaksi

  try {
    // 1. Verifikasi catatan peminjaman
    const pinjam = await Pinjam.findByPk(pinjamId, { transaction: t });
    if (!pinjam) {
      await t.rollback();
      return res
        .status(404)
        .json({ message: "Catatan peminjaman tidak ditemukan" });
    }

    // Pastikan buku belum dikembalikan (cek di tabel Pengembalian)
    const existingPengembalian = await Pengembalian.findOne({
      where: { pinjamId: pinjamId },
      transaction: t,
    });
    if (existingPengembalian) {
      await t.rollback();
      return res.status(400).json({ message: "Buku sudah dikembalikan" });
    }

    // 2. Tambah stok buku
    const buku = await Buku.findByPk(pinjam.bukuId, { transaction: t });
    if (!buku) {
      await t.rollback();
      return res.status(404).json({ message: "Buku terkait tidak ditemukan" });
    }
    await Buku.update(
      { stok: buku.stok + 1 },
      { where: { id: pinjam.bukuId }, transaction: t }
    );

    // 3. Buat catatan pengembalian baru
    const newPengembalian = await Pengembalian.create(
      {
        pinjamId,
        userId, // userId ini adalah user yang mengembalikan, bisa berbeda dengan pinjam.userId
        bukuId: pinjam.bukuId, // Pastikan bukuId dari catatan pinjam
        kondisi_buku,
        denda: denda || 0, // Default denda 0 jika tidak disertakan
      },
      { transaction: t }
    );
    await t.commit(); // Commit transaksi
    res.status(201).json(newPengembalian);
  } catch (error) {
    await t.rollback(); // Rollback jika ada error
    console.error("Error creating pengembalian:", error);
    res.status(400).json({ message: error.message });
  }
};
