const { ObjectId } = require("mongodb");

// Get client details handler
const getClientDetails = async (req, res, db) => {
    console.log("Get Client Details User:", req.user);
    if (!req.user || req.user.role !== 'client') {
        return res.status(403).json({
            error: "Access denied. Client role required.",
            receivedRole: req.user?.role
        });
    }

    try {
        const client = await db.collection("clients").findOne(
            { user_id: new ObjectId(req.user.userId) }
        );

        if (!client) {
            return res.status(404).send("Client not found");
        }

        res.json({
            email: client.email,
            username: client.username || "",
            full_name: client.full_name || "",
            wallet_balance: client.wallet_balance || 0,
            device_config: client.device_config || { public_key: "" },
            active_tunnel_id: client.active_tunnel_id || null,
            created_at: client.created_at
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

// Update client info handler
const updateClient = async (req, res, db) => {
    console.log("Update Client User:", req.user);
    if (!req.user || req.user.role !== 'client') {
        return res.status(403).json({
            error: "Access denied. Client role required.",
            receivedRole: req.user?.role
        });
    }

    const { full_name, username, device_config } = req.body;

    try {
        await db.collection("clients").updateOne(
            { user_id: new ObjectId(req.user.userId) },
            {
                $set: {
                    full_name,
                    username,
                    device_config
                }
            }
        );
        res.send("Client info updated");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

module.exports = {
    getClientDetails,
    updateClient
};
