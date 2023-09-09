//const Tour = require('../models/tourModel');

//ROUTE HANDLERS
exports.getAlltours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    // results: tours.length,
    // data: tours,
  });
};

exports.getTour = (req, res) => {
  // const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id);
  res.status(200).json({
    status: 'success',
    //data: tour,
  });
};

exports.createTour = (req, res) => {
  console.log(req.body);
  res.status(201).json({
    status: 'success',
    data: 'tour created',
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: 'tour updated',
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({ status: 'success', data: null });
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price)
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  next();
};
