const createError = require('http-errors');
const mongoose = require('mongoose');
const { User } = require('../models/user.model')
/////////////////////////////////////////////////////DELETE THIS LATER
module.exports.getUsers = (req, res, next) => {
    User.find()
        .then(users => res.json(users))
        .catch(next)
}
//////////////////////////////////////////////////////////////////////
module.exports.createUser = (req, res, next) => {
    console.log(req.body)
    const { email,password,type} = req.body;
    let avatar = null;
    if (req.file) {
        avatar = req.file.secure_url;
    }
    User.findOne({ email: email }).then(u => {
        if (u) {
            res.status(401).json({ error: "Email already in use" })
        } else {
            const newUser = new User({email,password,avatar,type});
            newUser.save()
                .then(
                    user => {
                        res.status(201).json({ user: user.email, avatar: user.avatar,type:user.type })
                    }
                )
                .catch(error => res.status(400).json(error));
        }
    })

};

module.exports.login = (req, res, next) => {
    const { email, password } = req.body;
    if (!email, !password) {
        res.status(400).json({ "error": "email and password required" })
    }
    User.findOne({ email: email }).then(
        user => {
            return user.checkPassword(password).then(
                match => {
                    if (!match) {
                        res.status(400).json({ "error": "email and password required" })
                    }
                    else {
                        req.session.user = user;
                        res.status(200).json(user)
                    }
                }
            )
        }
    ).catch(next)
}

module.exports.logout = (req, res, next) => {
    req.session.destroy()

    res.status(200).json({ "message": "User log out" })
}