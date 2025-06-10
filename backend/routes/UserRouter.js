import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/UserController.js";

// inisialisasi router
const router = express.Router();

// route untuk user
router.get("/user", getUsers);
router.get("/user/:id", getUserById);
router.patch("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

// ekspor router
export default router;
