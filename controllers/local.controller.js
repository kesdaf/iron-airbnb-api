const createError = require('http-errors');
const Local = require('../models/local.model')

module.exports.getLocals = (req, res, next) => {
    Local.find({ owner: req.session.user._id })
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

    Local.find(query).populate('owner').then(locals => res.json(locals.map((l) =>(
        {
            title:l.title,
            price:l.price,
            id:l._id,
            description:l.description,
            img:l.images?l.images[0]:'',
            latitude:l.location.coordinates[0],
            longitude:l.location.coordinates[1],
        }
    )
    )))
        .catch(next)
}

module.exports.createLocation = (req, res, next) => {
    const { title, options, images, price, description, lat, long } = req.body

    const newLocation = new Local({
        title, images, price, description,
        location: { "type": "Point", "coordinates": [long, lat] },
        owner: req.session.user._id
    });
    console.log(newLocation)
    newLocation.save().then(
        location => res.status(201).json(location)
    )
        .catch(next);
}

module.exports.getLocation = (req, res, next) => {
    console.log(req.params.id)
    Local.findById(req.params.id)
        .then(loc =>{
            res.json(loc)
        } )
        .catch(err => res.status(404).json({ "message": "Not found" }))
}

module.exports.deleteLocation = (req, res, next) => {
    console.log(req.params.id)
    Local.findById(req.params.id)
        .then(loc => {
            if (loc.owner = req.session.user._id) {
                Local.findByIdAndDelete({ "_id": req.params.id })
                    .then(loc => {
                        console.log(loc)
                        res.json(loc)
                    })
                    .catch(error => {
                        console.log(error)
                        res.status(405).json(error)
                    })
            }
        }).catch(error => {
            console.log(error)
            res.status(405).json(error)
        })
}