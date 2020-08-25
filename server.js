const express = require("express");
const ConnectDB = require("./config/connectDB");
const cors = require("cors");

const app = express();

// connecting the mysql database for Rozgar
ConnectDB();

app.use(cors({ origin: true, credentials: true }));
// Init Middleware
app.use(express.json({ extended: false }));

// starting api running
app.get("/", (req, res) => res.send("API running"));

// Defining API routes here
app.use("/api/userRegistration", require("./routes/api/userRegistration"));
app.use("/api/userLogin", require("./routes/api/userLogin"));
app.use("/api/auth", require("./routes/api/auth"));

const PORT = process.env.PORT || 5000;
const hostname = "192.168.43.100";

app.listen(PORT, hostname, () => {
  console.log(`Server started on http://${hostname} and port ${PORT}`);
});
