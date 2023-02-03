const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const ContenedorSesiones = require("../components/dao/sessions/Sessions");
const { isValidPassword } = require("./handlePass");

const manejadorSesiones = ContenedorSesiones.getInstance();

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await manejadorSesiones.findUser(email);

        if (!user) return done(null, false);

        if (!isValidPassword(user, password)) return done(null, false);

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  "singup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await manejadorSesiones.createUser({ email, password });

        if (user.err) return done(null, false);

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize
passport.serializeUser((email, done) => {
  done(null, email);
});

// Deserialize
passport.deserializeUser((email, done) => {
  done(null, email);
});

module.exports = passport;
