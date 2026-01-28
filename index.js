require("dotenv").config();

const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(express.json());

const PORT = 3000;

// const MONGO_URI = "mongodb+srv://peer2peer_vpn_db_user:DDDzK4DxXQwHqpNh@peer2peer-vpn.rrupom4.mongodb.net/store?retryWrites=true&w=majority";
const MONGO_URI = process.env.MONGO_URI;


const client = new MongoClient(MONGO_URI);

let db;

async function connectDB() {
  await client.connect();
  db = client.db("store");
  console.log("MongoDB connected");
}

connectDB();


app.get("/tunnel/:id/config", async (req, res) => {
  try {
    const tunnelId = req.params.id;

    const tunnel = await db
      .collection("active_tunnel")
      .findOne({ _id: new ObjectId(tunnelId) });

    if (!tunnel) {
      return res.status(404).send("Tunnel not found");
    }

    if (tunnel.tunnel_status !== "active") {
      return res.status(400).send("Tunnel not active");
    }

    const clientDoc = await db
      .collection("clients")
      .findOne({ _id: tunnel.client_id });

    const providerDoc = await db
      .collection("providers")
      .findOne({ _id: tunnel.provider_id });

    if (!clientDoc || !providerDoc) {
      return res.status(500).send("Client or Provider missing");
    }

    const clientConfig = `
[Interface]
PrivateKey = <CLIENT_PRIVATE_KEY>
Address = ${tunnel.wireguard_settings.assigned_client_ip}
DNS = 1.1.1.1

[Peer]
PublicKey = ${providerDoc.public_key}
Endpoint = ${providerDoc.public_ip}:${providerDoc.listen_port}
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = ${tunnel.wireguard_settings.persistent_keepalive}
`.trim();

    res.type("text/plain").send(clientConfig);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

