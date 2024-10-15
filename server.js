const express = require("express");
const app = express();

const Database = require("./components/Database");
const queries = require("./config/queries.json");
const db = new Database(queries);

const Session = require("./components/Session");
const session = new Session(app, db);

app.use(express.static("public"));
app.use("/static", express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const start = (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
};
app.get("/", start);

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Invalid data");
  } else {
    if (!session.sessionExist(req, res)) {
      await session.createSession(req, res);
    } else {
      res.status(400).send("La sesion ya existe");
    }
  }
});

app.post("/logout", async (req, res) => {});
app.post("/toProcess", async (req, res) => {});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Invalid data");
  }

  try {
    const checkUser = await db.query("checkUser", [username]);

    if (checkUser.rows.length) {
      return res.status(400).send("User already exists");
    }

    await db.query("register", [username, password]);

    res.send("User registered");
  } catch (error) {
    console.error("Error registering user", error.stack);
    if (!res.headersSent) {
      res.status(500).send("Internal Server Error");
    }
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
