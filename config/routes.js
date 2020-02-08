const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware') 
const userController = require('../controllers/user.controller');

//user
router.get('/user',authMiddleware.isAuthenticated, userController.getUsers)
router.post('/user',authMiddleware.isNotAuthenticated, userController.createUser)
router.post('/login', authMiddleware.isNotAuthenticated, userController.login)
router.post('/logout', authMiddleware.isAuthenticated, userController.logout)

module.exports = router;