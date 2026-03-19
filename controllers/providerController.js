const { ObjectId } = require("mongodb");

// Get provider details handler
const getProviderDetails = async (req, res, db) => {
    if (!req.user || req.user.role !== 'provider') {
        return res.status(403).json({ error: "Access denied. Provider role required." });
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
            is_listed: provider.is_listed || false,
            location: provider.location || "",
            created_at: provider.created_at
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

// Update provider info handler
const updateProvider = async (req, res, db) => {
    if (!req.user || req.user.role !== 'provider') {
        return res.status(403).json({ error: "Access denied. Provider role required." });
    }

    const { public_ip, listen_port, public_key, price_per_gb, location } = req.body;

    try {
        await db.collection("providers").updateOne(
            { user_id: new ObjectId(req.user.userId) },
            {
                $set: {
                    public_ip,
                    listen_port,
                    public_key,
                    price_per_gb: parseFloat(price_per_gb),
                    location: location || ""
                }
            }
        );
        res.send("Provider info updated");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

// Toggle marketplace listing
const toggleListing = async (req, res, db) => {
    if (!req.user || req.user.role !== 'provider') {
        return res.status(403).json({ error: "Access denied. Provider role required." });
    }

    try {
        const provider = await db.collection("providers").findOne(
            { user_id: new ObjectId(req.user.userId) }
        );

        if (!provider) {
            return res.status(404).send("Provider not found");
        }

        // Must have at least public_ip and public_key to list
        if (!provider.public_ip || !provider.public_key) {
            return res.status(400).json({ error: "Please configure your IP and public key before listing." });
        }

        const newStatus = !provider.is_listed;

        await db.collection("providers").updateOne(
            { user_id: new ObjectId(req.user.userId) },
            { $set: { is_listed: newStatus } }
        );

        res.json({ is_listed: newStatus });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

module.exports = {
    getProviderDetails,
    updateProvider,
    toggleListing
};
