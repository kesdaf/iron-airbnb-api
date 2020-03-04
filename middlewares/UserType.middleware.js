const {USERTYPE} = require('../models/user.model')

module.exports.isUser = (req, res, next) => {
    if (req.session.user && req.session.user.type === USERTYPE[0]) {
        next()
    } else {
        res.status(401).json();
    }
}

module.exports.isOwner = (req, res, next) => {
    if (req.session.user && req.session.user.type === USERTYPE[1]) {
        next()
    } else {
        res.status(401).json();
    }
}