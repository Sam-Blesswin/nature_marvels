const Tour = require('../models/tourModel');

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
    let query = Tour.find(JSON.parse(queryStr)); //mongoose method to find the tours in the DB

    //3)Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' '); //sort by multiple fields
      console.log(sortBy);
      //sort('price ratingAverage') //mongodb sorting syntax based on price and if same price then based on avg.
      query = query.sort(sortBy);
    } else {
      //default sorting
      query = query.sort('-createdAt');
    }

    //4)Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v'); //exclude the __v field
    }

    //5)Pagination
    //page=3&limit=10, 1-10 page 1, 11-20 page 2, 21-30 page 3
    const page = req.query.page * 1 || 1; //default page is 1 if no page is passed
    const limit = req.query.limit * 1 || 100; //default limit is 100 if no limit is passed
    const skip = (page - 1) * limit; //skip the first 10 results
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) {
        throw new Error('This page does not exist');
      }
    }
    query = query.skip(skip).limit(limit); //skip the first 10 results and limit the result to 10

    //EXECUTE QUERY
    const tours = await query;
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
