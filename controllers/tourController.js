const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

//ALIAS ROUTE HANDLERS
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//ROUTE HANDLERS
exports.getAllTours = async (req, res) => {
  console.log(req.requestTime);
  console.log(req.query);

  try {
    //BUILD AND EXECUTE QUERY
    //const feature = new APIFeatures(req.query,Tour.find()); //feature is an object of APIFeatures class //constructor is called
    const feature = new APIFeatures(req.query, Tour.find())
      .Filter()
      .Sort()
      .LimitFields()
      .Paginate(); //chaining of methods

    const tours = await feature.query;
    //query.sort().select().skip().limit()

    //SEND RESPONSEgi
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: tours,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //Tour.findOne({ _id: req.params.id }) //what mongoose does to find the element in bg
    res.status(200).json({
      status: 'success',
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  console.log(req.body);
  // const testTour = new Tour({})
  // testTour.save();

  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    //mongoose method to update the tour in the DB
    //new: true returns the updated document, runValidators: true runs the validators again
    //if the validators fail, the update will not be applied and the error will be thrown
    //if the validators pass, the update will be applied and the new document will be returned

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
