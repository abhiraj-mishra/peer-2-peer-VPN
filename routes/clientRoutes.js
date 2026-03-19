const express = require("express");
const router = express.Router();
const { getClientDetails, updateClient, getMarketplace, purchaseVPN, disconnectTunnel } = require("../controllers/clientController");
const { authenticateToken } = require("../middleware/auth");

const createClientRoutes = (db) => {
    router.get("/details", authenticateToken, (req, res) => getClientDetails(req, res, db));
    router.post("/update", authenticateToken, (req, res) => updateClient(req, res, db));
    router.get("/marketplace", authenticateToken, (req, res) => getMarketplace(req, res, db));
    router.post("/purchase", authenticateToken, (req, res) => purchaseVPN(req, res, db));
    router.post("/disconnect", authenticateToken, (req, res) => disconnectTunnel(req, res, db));

    return router;
};

module.exports = createClientRoutes;
