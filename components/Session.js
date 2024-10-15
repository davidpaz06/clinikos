class Session {
  constructor(app, db) {
    this.db = db;
    this.session = require("express-session");
    app.use(
      this.session({
        secret: "ufwx2335419ABXZ",
        resave: false,
        saveUninitialized: true,
        duration: 1800000,
        activeDuration: 900000,
        cookie: {
          expires: 1800000,
          secure: false,
          sameSite: true,
        },
      })
    );
  }

  sessionExist(req) {
    return req.session && req.session.user ? true : false;
  }

  async createSession(req, res) {
    const { username, password } = req.body;

    try {
      const user = await this.db.query("login", [username, password]);

      if (!user.rows.length) {
        return res.status(400).send("Datos incorrectos");
      }

      req.session.userId = user.rows[0].user_id;
      res.send(`Logged in as ${username}`);
    } catch (error) {
      console.error("Login error", error.stack);
      if (!res.headersSent) {
        res.status(500).send("Internal Server Error");
      }
    }
  }
}

module.exports = Session;
