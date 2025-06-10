import Pinjam from "../models/PinjamModel.js";

export const getPinjams = async (req, res) => {
  try {
    const pinjams = await Pinjam.findAll();
    res.json(pinjams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPinjamById = async (req, res) => {
  try {
    const pinjam = await Pinjam.findByPk(req.params.id);
    if (pinjam) {
      res.json(pinjam);
    } else {
      res.status(404).json({ message: "Pinjam not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPinjam = async (req, res) => {
  try {
    const newPinjam = await Pinjam.create(req.body);
    res.status(201).json(newPinjam);
  } catch (error) {
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
  try {
    const deleted = await Pinjam.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Pinjam not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
