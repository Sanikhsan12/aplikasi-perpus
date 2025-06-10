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
      return res.status(404).json({ message: "User not found" });
    }
    // cek apakah password yang dimasukkan sesuai dengan yang ada di database
    const isMatch = await bcrypt.compare(
      req.body.password,
      userAcc[0].password
    );
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
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
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    await user.create({
      username: username,
      email: email,
      password: hashedPassword,
      role: role,
    });

    res.status(201).json({ message: "Register successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
