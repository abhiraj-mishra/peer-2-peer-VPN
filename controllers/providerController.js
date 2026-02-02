const { ObjectId } = require("mongodb");

// Get provider details handler
const getProviderDetails = async (req, res, db) => {
    console.log("Get Provider Details User:", req.user);
    if (!req.user || req.user.role !== 'provider') {
        return res.status(403).json({
            error: "Access denied. Provider role required.",
            receivedRole: req.user?.role
        });
    }

    try {
        const provider = await db.collection("providers").findOne(
            { user_id: new ObjectId(req.user.userId) }
        );

        if (!provider) {
            return res.status(404).send("Provider not found");
        }

        res.json({
            email: provider.email,
            public_ip: provider.public_ip || "",
            listen_port: provider.listen_port || "",
            public_key: provider.public_key || "",
            price_per_gb: provider.price_per_gb || 0,
            created_at: provider.created_at
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

// Update provider info handler
const updateProvider = async (req, res, db) => {
    console.log("Update Provider Request User:", req.user);
    if (!req.user || req.user.role !== 'provider') {
        return res.status(403).json({
            error: "Access denied. Provider role required.",
            receivedRole: req.user?.role
        });
    }

    const { public_ip, listen_port, public_key, price_per_gb } = req.body;

    try {
        await db.collection("providers").updateOne(
            { user_id: new ObjectId(req.user.userId) },
            { $set: { public_ip, listen_port, public_key, price_per_gb: parseFloat(price_per_gb) } }
        );
        res.send("Provider info updated");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

module.exports = {
    getProviderDetails,
    updateProvider
};
