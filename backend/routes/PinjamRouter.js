import express from "express";
import {
  getPinjams,
  getPinjamById,
  createPinjam,
  updatePinjam,
  deletePinjam,
  returnPinjam,
  getPinjamByUserId,
} from "../controllers/PinjamController.js";

// inisialisasi router
const router = express.Router();

// route untuk pinjam
router.get("/pinjam", getPinjams);
router.get("/pinjam/:id", getPinjamById);
router.get("/pinjam/history/:userId", getPinjamByUserId);
router.post("/pinjam", createPinjam);
router.patch("/pinjam/:id", updatePinjam);
router.delete("/pinjam/:id", deletePinjam);
router.patch("/pinjam/:id/return", returnPinjam);

export default router;
