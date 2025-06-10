import express from "express";
import {
  getPengembalians,
  getPengembalianById,
  createPengembalian,
} from "../controllers/PengembalianController.js";

// inisialisasi router
const router = express.Router();

// route untuk pengembalian
router.get("/pengembalian", getPengembalians);
router.get("/pengembalian/:id", getPengembalianById);
router.post("/pengembalian", createPengembalian);

export default router;
