import express from "express";
import {
  login,
  register,
  tokenRefresh,
} from "../controllers/AuthController.js";

// inisialisasi router
const router = express.Router();

// route untuk login
router.post("/login", login);
router.post("/register", register);
router.post("/token", tokenRefresh);

export default router;
