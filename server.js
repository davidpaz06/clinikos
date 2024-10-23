const express = require("express");
const path = require("path");
const argon2 = require("argon2");
const app = express();

const Database = require("./components/Database");
const queries = require("./config/queries.json");
const db = new Database(queries);

const Session = require("./components/Session");
const session = new Session(app, db);

const Security = require("./components/Security");
const security = new Security();

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
  }

  if (!session.sessionExist(req)) {
    const result = await session.createSession(req);
    if (result.success) {
      return res.sendFile(path.join(__dirname, "public/home.html"));
    } else {
      return res.status(400).send(result.message);
    }
  } else {
    return res.status(400).send("La sesion ya existe");
  }
});

app.post("/logout", async (req, res) => {
  try {
    if (session.sessionExist(req)) {
      req.session.destroy((err) => {
        if (err) {
          console.error("Error al destruir la sesión:", err);
          return res.status(500).send("Error al cerrar la sesión");
        }
        res.sendFile(path.join(__dirname, "public/home.html"));
      });
    } else {
      res.status(400).send("No hay sesión activa");
    }
  } catch (error) {
    console.error("Error en el proceso de cierre de sesión:", error);
    res.status(500).send("Error interno del servidor");
  }
});

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

    const hashedPassword = await argon2.hash(password);
    await db.query("register", [username, hashedPassword]);

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
