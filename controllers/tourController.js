const Tour = require('../models/tourModel');

//ROUTE HANDLERS
exports.getAllTours = async (req, res) => {
  console.log(req.requestTime);
  console.log(req.query);

  try {
    //BUILD QUERY
    //1) Filtering
    const queryObj = { ...req.query }; //deep copy,copy by value not by reference
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    //2)Advanced filtering
    let queryStr = JSON.stringify(queryObj); //convert the queryObj to a string
    //{difficulty:'easy',duration:{$gte:5}} //mongodb querying syntax.
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); //Add the operators with $ operators
    console.log(JSON.parse(queryStr)); //convert the string to an object

    //fetch tours from DB that matches the query and convert it to JSON
    const query = Tour.find(JSON.parse(queryStr)); //mongoose method to find the tours in the DB
    //EXECUTE QUERY
    const tours = await query;

    //
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
