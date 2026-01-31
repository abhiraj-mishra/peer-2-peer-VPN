const express = require("express");
const router = express.Router();
const { getProviderDetails, updateProvider } = require("../controllers/providerController");
const { authenticateToken } = require("../middleware/auth");

const createProviderRoutes = (db) => {
    router.get("/details", authenticateToken, (req, res) => getProviderDetails(req, res, db));
    router.post("/update", authenticateToken, (req, res) => updateProvider(req, res, db));

    return router;
};

module.exports = createProviderRoutes;

