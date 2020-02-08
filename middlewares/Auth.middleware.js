module.exports.isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        res.status(401).json({ "error": "User not logged in" });
    }
}

module.exports.isNotAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        next()
    } else {
        res.status(401).json({ "error": "User logged in" });
    }
}