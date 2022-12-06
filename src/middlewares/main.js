const mainMiddleware = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/pages/login.html')
    } else {
        next()
    }
}

module.exports = mainMiddleware