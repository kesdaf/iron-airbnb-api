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
    Reserve = localReserve.findById({ _id: req.params.id }).populate('local')
        .then(reserve => {
            console.log(reserve)
            if (reserve.local.owner == req.session.user._id) {
                reserve.accepted = true;
                reserve.save().then(validated => res.json(validated)).catch(next)
            } else {
                res.status(401).json()
            }
        })
        .catch(next)
}
module.exports.deleteReserve = (req, res, next) => {
    localReserve.findById({ _id: req.params.id }).populate('local')
        .then(reserve => {
            if (reserve && !reserve.accepted && reserve.local.owner == req.session.user._id) {

                localReserve.deleteOne({ _id: req.params.id })
                    .then(loc => {
                        if (loc.deletedCount > 0) {
                            res.status(204).json(loc)
                        } else {
                            res.status(401).json()
                        }
                    })
                    .catch(error => res.status(401).json(error))
            } else {
                res.status(401).json()
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
                    res.status(401).json()
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