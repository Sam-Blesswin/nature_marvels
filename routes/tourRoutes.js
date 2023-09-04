const express = require('express');
const tourController = require('../controllers/tourController');

//ROUTES
const router = express.Router();

//Param Middleware
router.param('id', tourController.checkID);

router
  .route('/')
  .get(tourController.getAlltours)
  .post(tourController.checkBody, tourController.createTour); //chaining middleware
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
