const createError = require('http-errors');
const localComment = require('../models/local.comment.model')

module.exports.createComment = (req, res, next) => {
    const newComment = new localComment({ ...req.body, user: req.session.user._id })
    newComment.save().then(comment => res.json(comment)).catch(next)
}

module.exports.responseComment = (req, res, next) => {
    const newComment = new localComment({
        ...req.body,
        user: req.session.user._id,
        idParent: req.params.id
    })
    newComment.save().then(comment => res.json(comment)).catch(next)
}

module.exports.getComment = (req, res, next) => {
    localComment.find({ local: req.params.id })
        .populate('user')
        .then(comments => res.json(comments))
        .catch(next)
}