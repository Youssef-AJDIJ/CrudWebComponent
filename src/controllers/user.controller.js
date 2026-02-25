const { User } = require("../models");

// GET all users
const getAll = async (req, res) => {
  try {
    const users = await User.findAll({ order: [["createdAt", "DESC"]] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET user by id
const getById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST create user
const create = async (req, res) => {
  try {
    const { user, email, phone } = req.body;
    if (!user || !email) {
      return res.status(400).json({ error: "user and email are required" });
    }
    const newUser = await User.create({ user, email, phone });
    res.status(201).json(newUser);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Email already exists" });
    }
    if (error.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({ error: error.errors.map((e) => e.message).join(", ") });
    }
    res.status(500).json({ error: error.message });
  }
};

// PUT update user
const update = async (req, res) => {
  try {
    const found = await User.findByPk(req.params.id);
    if (!found) return res.status(404).json({ error: "User not found" });
    const { user, email, phone } = req.body;
    await found.update({ user, email, phone });
    res.json(found);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Email already exists" });
    }
    if (error.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({ error: error.errors.map((e) => e.message).join(", ") });
    }
    res.status(500).json({ error: error.message });
  }
};

// DELETE user
const remove = async (req, res) => {
  try {
    const found = await User.findByPk(req.params.id);
    if (!found) return res.status(404).json({ error: "User not found" });
    await found.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
