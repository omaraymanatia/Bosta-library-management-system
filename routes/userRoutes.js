const express = require('express');

const userController = require('../controllers/userController');


const router = express.Router();

router.route('/').post(userController.createUser).patch(userController.updateUser).delete;(userController.deleteUser);
