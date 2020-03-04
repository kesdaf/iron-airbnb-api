const createError = require('http-errors');
const localComment = require('../models/local.comment.model')
const localReserve = require('../models/local.reserve.model')

module.exports.createComment = (req, res, next) => {
    const { reserve } = req.body;
    localReserve.find({ _id: reserve, accepted: true, init_date: { $lt: new Date() } })
        .then(r => {
            if (r) {
                localComment.findOne({ reserve: reserve, user: req.session.user._id })
                    .then(found => {
                        if (!found) {
                            const newComment = new localComment({ ...req.body, user: req.session.user._id })
                            newComment.save().then(comment => res.json(comment)).catch(next)
                        } else {
                            res.status(401).json()
                        }
                    })
                    .catch(next)
            }else{
                res.status(401).json() 
            }
        })
        .catch(next)

}

module.exports.responseComment = (req, res, next) => {
    localComment.find({ _id: req.params.id }).populate({ path: 'reserve', populate: { path: 'local' } })
        .then(baseComment => {
            if (baseComment.user == req.session.user._id ||
                baseComment.reserve.local.owner == req.session.user._id) {
                const newComment = new localComment({
                    ...req.body,
                    user: req.session.user._id,
                    idParent: req.params.id
                })
                newComment.save().then(comment => res.json(comment)).catch(next)
            } else {
                res.status(401).json();
            }
        })
        .catch(next)
}

module.exports.getComment = (req, res, next) => {
    localComment.find({ local: req.params.id })
        .populate('user')
        .then(comments => res.json(comments))
        .catch(next)
}