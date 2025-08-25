const express = require('express');

const userController = require('../controllers/userController');

const router = express.Router();

router
  .route('/')
  .get(userController.getAllUsers) // admin gets all users
  .post(userController.createUser) // admin create a user
  .patch(userController.updateUser) // admin updates a user
  .delete(userController.deleteUser); // admin deletes a user


router.route('/:id')
  .get(userController.getUserById) // admin gets a user by ID
  .patch(userController.updateUser) // admin updates a user by ID
  .delete(userController.deleteUser); // admin deletes a user by ID

module.exports = router;
