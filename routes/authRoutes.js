const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

const createAuthRoutes = (db) => {
    router.post("/register", (req, res) => register(req, res, db));

    router.post("/login", (req, res) => login(req, res, db));

    return router;
};

module.exports = createAuthRoutes;
