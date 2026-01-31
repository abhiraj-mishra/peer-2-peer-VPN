require("dotenv").config();

const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(express.json());

const PORT = 3000;

const MONGO_URI = process.env.MONGO_URI;
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const client = new MongoClient(MONGO_URI);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
const JWT_SECRET = process.env.JWT_SECRET

let db;

async function connectDB() {
  await client.connect();
  db = client.db("store");
  console.log("MongoDB connected");
}

connectDB();

// Register 
app.post("/auth/register", async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) return res.status(400).send("Missing fields");

  try {
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) return res.status(400).send("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.collection("users").insertOne({
      email,
      password: hashedPassword,
      role,
      created_at: new Date()
    });

    const userId = result.insertedId;

    if (role === "client") {
      await db.collection("clients").insertOne({
        user_id: userId,
        email,
        full_name: "",
        created_at: new Date()
      });
    } else if (role === "provider") {
      await db.collection("providers").insertOne({
        user_id: userId,
        email,
        public_ip: "",
        listen_port: "",
        public_key: "",
        created_at: new Date()
      });
    }

    res.status(201).send("User registered");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


// Login

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.collection("users").findOne({ email });
    if (!user) return res.status(400).send("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid credentials");

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


// Middleware to verify Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post("/api/provider/update", authenticateToken, async (req, res) => {
  if (req.user.role !== 'provider') return res.sendStatus(403);

  const { public_ip, listen_port, public_key } = req.body;
  try {
    await db.collection("providers").updateOne(
      { user_id: new ObjectId(req.user.userId) },
      { $set: { public_ip, listen_port, public_key } }
    );
    res.send("Provider info updated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/api/client/update", authenticateToken, async (req, res) => {
  if (req.user.role !== 'client') return res.sendStatus(403);

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
});


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

