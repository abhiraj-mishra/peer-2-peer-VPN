const { ObjectId } = require("mongodb");

// Get client details handler
const getClientDetails = async (req, res, db) => {
    if (req.user.role !== 'client') {
        return res.sendStatus(403);
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
            full_name: client.full_name || "",
            created_at: client.created_at
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

// Update client info handler
const updateClient = async (req, res, db) => {
    if (req.user.role !== 'client') {
        return res.sendStatus(403);
    }

    const { full_name } = req.body;

    try {
        await db.collection("clients").updateOne(
            { user_id: new ObjectId(req.user.userId) },
            { $set: { full_name } }
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
