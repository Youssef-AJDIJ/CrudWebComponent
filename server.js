require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./src/models");
const userRoutes = require("./src/routes/user.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public/
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api/users", userRoutes);

// Fallback: serve index.html for any non-API route
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Connect DB and start server
sequelize
  .authenticate()
  .then(() => {
    console.log("✅  Database connected successfully");
    return sequelize.sync(); // sync models (non-destructive)
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀  Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌  Unable to connect to the database:", err);
  });
