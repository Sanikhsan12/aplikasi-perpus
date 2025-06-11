import user from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    // cek apakah email dan password sudah diisi
    const userAcc = await user.findAll({
      where: {
        email: req.body.email,
      },
    });
    // jika tidak ada user dengan email tersebut
    if (userAcc.length === 0) {
      return res.status(404).json({ message: "User Tidak Ditemukan" });
    }
    // cek apakah password yang dimasukkan sesuai dengan yang ada di database
    const isMatch = await bcrypt.compare(
      req.body.password,
      userAcc[0].password
    );
    if (!isMatch) {
      return res.status(400).json({ message: "Email Atau Password Salah" });
    }

    const userId = userAcc[0].id;
    const username = userAcc[0].username;
    const role = userAcc[0].role;
    const email = userAcc[0].email;

    const token = jwt.sign(
      {
        userId,
        username,
        role,
        email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    // cek apakah email sudah terdaftar
    const existingUser = await user.findOne({
      where: { email: email },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email Sudah Terdaftar" });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    await user.create({
      username: username,
      email: email,
      password: hashedPassword,
      role: role,
    });

    res.status(201).json({ message: "Register Berhasil" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const tokenRefresh = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({ message: "Token tidak disediakan" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Token tidak valid atau kedaluwarsa" });
      }

      // Buat token baru dengan masa berlaku yang diperbarui
      const newToken = jwt.sign(
        {
          userId: decoded.userId,
          username: decoded.username,
          role: decoded.role,
          email: decoded.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h", // Sesuaikan masa berlaku token
        }
      );

      res.status(200).json({ accessToken: newToken });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
