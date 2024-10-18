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

// lo que paso fue que teniamos el componente de sesion acoplado porque le deciamos que el
// despachaba la respuesta al cliente una vez iniciara sesion
// (lo cual es cierto pero definimos una respuesta estatica) lo que cambie fue que el createSession()
// que no regrese una response directamente sino que retorne un objeto con una propiedad en base a cual el servidor
// va a emitir su respuesta.

// agregue la opcion de logout.Session

// hice pruebas iniciales digames y pasó todo bien, igual cuando hagas pull córrelo y verifica y trata de hallar algunna incongruencia
// o error que se me haya escapado.
