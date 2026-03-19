const { ObjectId } = require("mongodb");

// Get client details handler
const getClientDetails = async (req, res, db) => {
    if (!req.user || req.user.role !== 'client') {
        return res.status(403).json({ error: "Access denied. Client role required." });
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
    if (!req.user || req.user.role !== 'client') {
        return res.status(403).json({ error: "Access denied. Client role required." });
    }

    const { full_name, username, device_config } = req.body;

    try {
        await db.collection("clients").updateOne(
            { user_id: new ObjectId(req.user.userId) },
            { $set: { full_name, username, device_config } }
        );
        res.send("Client info updated");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

// Get marketplace - all listed providers
const getMarketplace = async (req, res, db) => {
    if (!req.user || req.user.role !== 'client') {
        return res.status(403).json({ error: "Access denied. Client role required." });
    }

    try {
        const providers = await db.collection("providers")
            .find({ is_listed: true })
            .project({
                _id: 1,
                email: 1,
                public_ip: 1,
                listen_port: 1,
                price_per_gb: 1,
                location: 1
            })
            .toArray();

        // Mask part of the IP for privacy until purchased
        const masked = providers.map(p => ({
            ...p,
            public_ip_masked: p.public_ip
                ? p.public_ip.replace(/(\d+)\.(\d+)\.(\d+)\.(\d+)/, '$1.$2.*.*')
                : ''
        }));

        res.json(masked);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

// Purchase VPN — creates an active tunnel record
const purchaseVPN = async (req, res, db) => {
    if (!req.user || req.user.role !== 'client') {
        return res.status(403).json({ error: "Access denied. Client role required." });
    }

    const { provider_id } = req.body;

    if (!provider_id) {
        return res.status(400).json({ error: "provider_id is required." });
    }

    try {
        const provider = await db.collection("providers").findOne({
            _id: new ObjectId(provider_id),
            is_listed: true
        });

        if (!provider) {
            return res.status(404).json({ error: "Provider not found or not listed." });
        }

        const client = await db.collection("clients").findOne(
            { user_id: new ObjectId(req.user.userId) }
        );

        if (!client) {
            return res.status(404).json({ error: "Client not found." });
        }

        // Create a tunnel record
        const tunnel = {
            client_id: client._id,
            provider_id: provider._id,
            tunnel_status: "active",
            created_at: new Date(),
            wireguard_settings: {
                assigned_client_ip: "10.0.0.2/32",
                persistent_keepalive: 25
            }
        };

        const result = await db.collection("active_tunnel").insertOne(tunnel);
        const tunnelId = result.insertedId;

        // Update client with active tunnel
        await db.collection("clients").updateOne(
            { _id: client._id },
            { $set: { active_tunnel_id: tunnelId } }
        );

        res.json({
            tunnelId: tunnelId.toString(),
            provider: {
                public_ip: provider.public_ip,
                listen_port: provider.listen_port,
                price_per_gb: provider.price_per_gb
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

// Disconnect active tunnel
const disconnectTunnel = async (req, res, db) => {
    if (!req.user || req.user.role !== 'client') {
        return res.status(403).json({ error: "Access denied. Client role required." });
    }

    try {
        const client = await db.collection("clients").findOne(
            { user_id: new ObjectId(req.user.userId) }
        );

        if (!client || !client.active_tunnel_id) {
            return res.status(400).json({ error: "No active tunnel to disconnect." });
        }

        await db.collection("active_tunnel").updateOne(
            { _id: client.active_tunnel_id },
            { $set: { tunnel_status: "inactive" } }
        );

        await db.collection("clients").updateOne(
            { _id: client._id },
            { $set: { active_tunnel_id: null } }
        );

        res.json({ message: "Disconnected successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

module.exports = {
    getClientDetails,
    updateClient,
    getMarketplace,
    purchaseVPN,
    disconnectTunnel
};
