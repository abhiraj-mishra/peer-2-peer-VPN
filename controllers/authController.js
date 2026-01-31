const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Register handler
const register = async (req, res, db) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return res.status(400).send("Missing fields");
    }

    try {
        const existingUser = await db.collection("users").findOne({ email });
        if (existingUser) {
            return res.status(400).send("User already exists");
        }

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
};

// Login handler
const login = async (req, res, db) => {
    const { email, password } = req.body;
    try {
        const user = await db.collection("users").findOne({ email });
        if (!user) {
            return res.status(400).send("User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid credentials");
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.json({ token, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

module.exports = {
    register,
    login
};
