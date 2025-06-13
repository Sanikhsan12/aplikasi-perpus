// backend/controllers/BookController.js
import { Op } from "sequelize";
import Buku from "../models/BookModel.js";

export const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    const where = {
      [Op.or]: [
        { judul: { [Op.like]: `%${search}%` } },
        { penulis: { [Op.like]: `%${search}%` } },
        { penerbit: { [Op.like]: `%${search}%` } },
      ],
    };

    const { count, rows } = await Buku.findAndCountAll({
      where: search ? where : {},
      limit: limit,
      offset: offset,
    });
    res.json({
      totalItems: count,
      books: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Buku.findByPk(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBook = async (req, res) => {
  try {
    const newBook = await Buku.create(req.body);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const [updated] = await Buku.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedBook = await Buku.findByPk(req.params.id);
      res.status(200).json(updatedBook);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const deleted = await Buku.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
