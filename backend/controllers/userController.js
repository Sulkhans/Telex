import prisma from "../db/prisma.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import generateToken from "../utils/generateToken.js";
import { io, onlineUsers } from "../socket/socket.js";

const createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      confirmPassword,
      gender,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      gender == undefined
    )
      throw new Error("Please fill all inputs");
    if (username.length < 6)
      throw new Error("Username must be at least 6 characters");
    const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!mailRegex.test(email))
      throw new Error("Please enter a valid email address");
    if (password !== confirmPassword) throw new Error("Passwords do not match");
    if (password.length < 6)
      throw new Error("Password must be at least 6 characters");
    const numRegex = /\d/;
    if (!numRegex.test(password))
      throw new Error("Password must contain at least one number");

    const userExists = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
    });
    if (userExists) throw new Error("User with this username already exists");

    const emailExists = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (emailExists) throw new Error("User with this email already exists");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const token = crypto.randomBytes(32).toString("hex");

    try {
      const user = await prisma.user.create({
        data: {
          token,
          username: username.toLowerCase(),
          email: email.toLowerCase(),
          password: hashedPassword,
          fullName: `${firstName[0].toUpperCase() + firstName.slice(1)} ${
            lastName[0].toUpperCase() + lastName.slice(1)
          }`,
          image: `/${gender ? "boy" : "girl"}?username=${username}`,
          gender,
        },
      });
      const confirmLink = `${process.env.CORS_ORIGIN}/verify?token=${token}`;
      await sendEmail(email, user.fullName, confirmLink);
      res.status(201).json({
        message:
          "Registration successful. Check your email to verify your account",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await prisma.user.findUnique({ where: { token } });
    if (!user) return res.status(400).json({ message: "Token is invalid" });
    await prisma.user.update({
      where: { id: user.id },
      data: { verified: true, token: null },
    });
    res
      .status(200)
      .json({ message: "Email verified successfully. You can now log in" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ message: "User was not found" });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Password is incorrect" });
    if (!user.verified)
      return res.status(401).json({ message: "Account is not verified" });
    await prisma.user.update({
      where: { username },
      data: { status: "online" },
    });
    generateToken(res, user.id);
    res.status(200).json({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      image: user.image,
      status: "online",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { id, username, fullName, image, status } = req.user;
    const session = onlineUsers.get(id);
    if (!session) {
      const user = await prisma.user.update({
        where: { id },
        data: { status: "online" },
      });
      return res.status(200).json(user);
    }
    res.status(200).json({ id, username, fullName, image, status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await prisma.user.update({
      where: { id: req.user.id },
      data: { status: status },
    });
    io.emit("user:status", { userId: req.user.id, status });
    res.json({ message: `User status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    const { id } = req.user;
    await prisma.user.update({
      where: { id },
      data: { status: "offline" },
    });
    onlineUsers.delete(id);
    io.emit("user:status", { userId: id, status: "offline" });
    res.cookie("jwt", "", { httpOnly: false, expires: new Date(0) });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createUser,
  verifyEmail,
  loginUser,
  getUser,
  updateStatus,
  logoutUser,
};
