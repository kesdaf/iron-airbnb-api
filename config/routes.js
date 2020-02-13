const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const userTypeMiddlewate = require('../middlewares/UserType.middleware');

const userController = require('../controllers/user.controller');
const localController = require('../controllers/local.controller');
const reserve = require('../controllers/local.reserve.controller');
const localComment = require('../controllers/local.comments.controller')

//user
router.get('/user', authMiddleware.isAuthenticated, userController.getUsers)
router.post('/user', authMiddleware.isNotAuthenticated, userController.createUser)
router.post('/login', authMiddleware.isNotAuthenticated, userController.login)
router.post('/logout', authMiddleware.isAuthenticated, userController.logout)

//Locals
router.get('/locals', authMiddleware.isAuthenticated,
    localController.getLocals)
router.post('/locals', authMiddleware.isAuthenticated, userTypeMiddlewate.isOwner,
    localController.createLocation)
router.get('/locals/:id', authMiddleware.isAuthenticated, localController.getLocation)
router.post('/findLocal', authMiddleware.isAuthenticated,
    localController.findLocal)

router.delete('/locals/:id', authMiddleware.isAuthenticated, userTypeMiddlewate.isOwner,
    localController.deleteLocation)
//Reserves
router.post('/reserve', authMiddleware.isAuthenticated, userTypeMiddlewate.isUser,
    reserve.createReserve)
router.patch('/reserve/:id', authMiddleware.isAuthenticated, userTypeMiddlewate.isOwner,
    reserve.validateReserve)
router.delete('/reserve/:id', authMiddleware.isAuthenticated, userTypeMiddlewate.isOwner,
    reserve.deleteReserve)
router.get('/reserve/:local',authMiddleware.isAuthenticated, reserve.getLocalReserves)
router.get('/reserve',authMiddleware.isAuthenticated, reserve.getMyLocalReserves)

//Comments
router.post('/comment',authMiddleware.isAuthenticated,userTypeMiddlewate.isUser,
    localComment.createComment)
router.post('/comment/:id',authMiddleware.isAuthenticated, localComment.responseComment)
router.get('/comment',authMiddleware.isAuthenticated, localComment.getComment)

//chat
router.get('/conversation/:local', authMiddleware.isAuthenticated)

module.exports = router;