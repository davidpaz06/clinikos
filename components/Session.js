class Session {
  constructor(app, db) {
    this.db = db;
    this.session = require("express-session");
    app.use(
      this.session({
        secret: "ufwx2335419ABXZ",
        resave: false,
        saveUninitialized: true,
        cookie: {
          maxAge: 1800000,
          secure: false,
          sameSite: true,
        },
      })
    );
  }

  sessionExist(req) {
    return req.session && req.session.userId ? true : false;
  }

  async createSession(req) {
    const { username, password } = req.body;

    try {
      const user = await this.db.query("login", [username, password]);

      if (!user.rows.length) {
        return { success: false, message: "Datos incorrectos" };
      }

      req.session.userId = user.rows[0].user_id;
      return { success: true };
    } catch (error) {
      console.error("Login error", error.stack);
      return { success: false, message: "Internal Server Error" };
    }
  }
}

module.exports = Session;

