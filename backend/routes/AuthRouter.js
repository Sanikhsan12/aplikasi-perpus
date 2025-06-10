import express from "express";
import { login, register } from "../controllers/AuthController.js";

// inisialisasi router
const router = express.Router();

// route untuk login
router.post("/login", login);
router.post("/register", register);

export default router;
