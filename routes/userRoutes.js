const express = require('express');
const userController = require('./../controllers/userController');

//ROUTES
const router = express.Router();
router
  .route('/api/v1/users')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/api/v1/users/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
