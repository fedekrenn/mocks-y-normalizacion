const mainMiddleware = (req, res, next) => {
    if (!req.session.nameAccess) {
        res.redirect('/pages/login.html')
    } else {
        next()
    }
}

module.exports = mainMiddleware