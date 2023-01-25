const { loggerError } = require("../utils/logger");
const passport = require("passport");

const mainRoute = async (req, res) => {
    req.session.nameAccess = req.user.email;
    res.redirect("/pages/products.html");
};

const loginRoute = passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/pages/login-error.html",
    passReqToCallback: true,
});

const registerRoute = passport.authenticate("singup", {
    successRedirect: "/",
    failureRedirect: "/pages/register-error.html",
    passReqToCallback: true,
});

const logoutRoute = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            loggerError.error(err);
            return next(err);
        }

        req.session.destroy();
        res.redirect("/");
    });
};

const getNameRoute = async (req, res) => {
    res.send({ nameAccess: req.session.nameAccess });
};

module.exports = {
    mainRoute,
    loginRoute,
    registerRoute,
    logoutRoute,
    getNameRoute
};
