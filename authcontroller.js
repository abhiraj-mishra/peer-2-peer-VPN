require("dotenv").config();


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