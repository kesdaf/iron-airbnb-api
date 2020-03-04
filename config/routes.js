const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const userTypeMiddlewate = require('../middlewares/UserType.middleware');
const uploadCloud = require('./cloudinary-setup.config');

const userController = require('../controllers/user.controller');
const localController = require('../controllers/local.controller');
const reserve = require('../controllers/local.reserve.controller');
const localComment = require('../controllers/local.comments.controller');
const userConversation = require('../controllers/user.conversation.controller');

//user
router.get('/user', authMiddleware.isAuthenticated, userController.getUsers);
router.post('/user', authMiddleware.isNotAuthenticated, uploadCloud.single('avatar'), userController.createUser);
router.post('/login', userController.login);
router.post('/logout', authMiddleware.isAuthenticated, userController.logout);

//Locals
router.get('/locals', authMiddleware.isAuthenticated, userTypeMiddlewate.isOwner,
    localController.getLocals);
router.post('/locals', authMiddleware.isAuthenticated, userTypeMiddlewate.isOwner,
uploadCloud.array('images'), localController.createLocation);
router.get('/locals/:id', authMiddleware.isAuthenticated, localController.getLocation);
router.delete('/locals/:id', authMiddleware.isAuthenticated, userTypeMiddlewate.isOwner,
    localController.deleteLocation);
router.post('/findLocal', authMiddleware.isAuthenticated,
    localController.findLocal);
//Reserves
router.get('/reserve',authMiddleware.isAuthenticated, reserve.getMyLocalReserves);
router.post('/reserve', authMiddleware.isAuthenticated, userTypeMiddlewate.isUser,
    reserve.createReserve);
router.patch('/reserve/:id', authMiddleware.isAuthenticated, userTypeMiddlewate.isOwner,
    reserve.validateReserve);
router.delete('/reserve/:id', authMiddleware.isAuthenticated, userTypeMiddlewate.isOwner,
    reserve.deleteReserve);
router.get('/reserve/local/:local',authMiddleware.isAuthenticated, reserve.getLocalReserves);

//Comments
router.get('/comment',authMiddleware.isAuthenticated, localComment.getComment);
router.post('/comment',authMiddleware.isAuthenticated,userTypeMiddlewate.isUser,
    localComment.createComment);
router.post('/comment/:id',authMiddleware.isAuthenticated, localComment.responseComment);

//chat
router.get('/conversation/:local', authMiddleware.isAuthenticated, userConversation.getConversation);
router.post('/conversation/:local',authMiddleware.isAuthenticated, userConversation.setMessage);

module.exports = router;