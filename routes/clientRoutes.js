const express = require("express");
const router = express.Router();
const { getClientDetails, updateClient } = require("../controllers/clientController");
const { authenticateToken } = require("../middleware/auth");

const createClientRoutes = (db) => {
    router.get("/details", authenticateToken, (req, res) => getClientDetails(req, res, db));
    router.post("/update", authenticateToken, (req, res) => updateClient(req, res, db));

    return router;
};

module.exports = createClientRoutes;

