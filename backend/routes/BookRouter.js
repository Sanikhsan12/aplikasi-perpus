import express from "express";
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/BookController.js";

// inisialisasi router
const router = express.Router();

// route untuk buku
router.get("/book", getBooks);
router.get("/book/:id", getBookById);
router.post("/book", createBook);
router.patch("/book/:id", updateBook);
router.delete("/book/:id", deleteBook);

// ekspor router
export default router;
