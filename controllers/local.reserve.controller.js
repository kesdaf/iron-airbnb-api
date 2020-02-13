const createError = require('http-errors');
const mongoose = require('mongoose');
const localReserve = require('../models/local.reserve.model')
const Local = require('../models/local.model')
const { USERTYPE } = require('../models/user.model')

module.exports.createReserve = (req, res, next) => {
    const { local, init_date, finish_date } = req.body;
    console.log({ local, init_date, finish_date })
    const newlocalReserve = new localReserve({
        user: req.session.user._id,
        local: local,
        init_date: new Date(init_date),
        finish_date: new Date(finish_date),
        accepted: false
    })
    newlocalReserve.save()
        .then(reserve => res.json(reserve))
        .catch(next)
}

module.exports.validateReserve = (req, res, next) => {
    Reserve = localReserve.findById({ _id: req.params.id }).populate('location')
        .then(reserve => {
            if (reserve.location.owner == req.session.user._id) {
                reserve.accepted = true;
                reserve.save().then(res => res.json(res)).catch(next)
            } else {
                res.status(401)
            }
        })
        .catch(next)
}
module.exports.deleteReserve = (req, res, next) => {
    Reserve = localReserve.findById({ _id: req.params.id }).populate('location')
        .then(reserve => {
            if (reserve.accepted && reserve.location.owner == req.session.user._id) {
                reserve.delete()
            } else {
                res.status(401)
            }
        })
        .catch(next)
}

module.exports.getLocalReserves = (req, res, next) => {
    if (req.session.user.type == USERTYPE[0]) {
        localReserve.find({ local: req.params.local, accepted: true })
            .then(reserves => {
                res.json(reserves.map(r => { return { init_date: r.init_date, finish_date: r.finish_date } }))
            })
            .catch(next)
    } else if ((req.session.user.type == USERTYPE[1])) {
        localReserve.find({ local: req.params.local, accepted: true })
            .populate('location')
            .then(reserves => {
                if (reserves.length > 0 && reserves[0].owner == req.session.user._id) {
                    res.json(reserves)
                } else {
                    res.status(401)
                }
            })
            .catch(next)
    }

}

module.exports.getMyLocalReserves = (req, res, next) => {
    if (req.session.user.type == USERTYPE[0]) {
        Reserve = localReserve.find({ user: req.session.user._id })
            .then(reserves => {
                res.json(reserves)
            })
            .catch(next)
    } else if ((req.session.user.type == USERTYPE[1])) {
        Local.find({ owner: req.session.user._id })
            .then(locals => {
                Reserve = localReserve.find({ local: { $in: locals.map(loc => loc._id) } })
                    .then(reserves => {
                        res.json(reserves)
                    }).catch(next)
            })
            .catch(next)
    }

}