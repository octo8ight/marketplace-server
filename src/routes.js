const express = require('express');
const router = express.Router();

const AuthValidator = require('./validators/AuthValidators');
const UserValidator = require('./validators/UserValidators');

const Auth = require('./middlewares/Auth');

const AuthController = require('./controllers/AuthController');
const ModuleController = require('./controllers/ModuleController');
const UserController = require('./controllers/UserController');

router.post('/user/signin',AuthValidator.signin, AuthController.signin);
router.post('/user/signup', AuthValidator.signup, AuthController.signup);
router.get('/user/me', Auth.private, UserController.getInfo);
router.post('/user/me', UserValidator.editAction, Auth.private, UserController.setInfo);

router.get('/get/list', ModuleController.getList);
router.get('/get/item', ModuleController.getItem);

router.post('/create/list', Auth.private, ModuleController.createList);
router.post('/create/offer', Auth.private, ModuleController.createOffer);
router.post('/accept/offer', Auth.private, ModuleController.acceptOffer);
router.post('/buy/item', Auth.private, ModuleController.buyNow);


module.exports = router;