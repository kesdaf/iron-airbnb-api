const createError = require('http-errors');
const Local = require('../models/local.model')

module.exports.getLocals = (req, res, next) => {
    Local.find()
        .populate('owner')
        .then(locals => res.json(locals))
        .catch(next)
}

module.exports.findLocal = (req, res, next) => {
    const { latitude, longitude, distance, price_min, price_max } = req.body;
    if (!latitude || !longitude) {
        res.status(400).json({ "error": "incorrect query" })
    }
    if (!distance) {
        distance = 1000
    }
    let query = {
        location: {
            $near: {
                $maxDistance: distance,
                $geometry: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                }
            }
        }
    }
    if (price_min && price_max) {
        query = {
            ...query,
            price: { $gte: price_min, $lte: price_max }
        }
    } else if (price_min) {
        query = {
            ...query,
            price: { $gte: min_price }
        }
    } else if (price_max) {
        query = {
            ...query,
            price: { $lte: price_max }
        }
    }

    Local.find(query).populate('owner').then(locals => res.json(locals))
        .catch(next)
}

module.exports.createLocation = (req, res, next) => {
    const newLocation = new Local({ ...req.body, owner: req.session.user._id });

    newLocation.save().then(
        location => res.status(201).json(location)
    )
        .catch(next);
}

module.exports.getLocation = (req, res, next) => {
    Local.findById(req.params.id)
        .then(loc => res.json(loc))
        .catch(err => res.status(404).json({"message":"Not found"}))
}

module.exports.deleteLocation = (req, res, next) => {
    Local.deleteOne({ _id: req.params.id, owner: req.session._id })
        .then(loc => {
            if(loc.deletedCount>0){
                res.status(204).json(loc)
            }else{
                res.status(401).json()
            }
        })
        .catch(error => res.status(401).json(error))
}