const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

//ALIAS ROUTE HANDLERS
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//AGGREGATION
exports.getTourStats = catchAsync(async (req, res, next) => {
  const tourStats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }, //filters the document
    },
    {
      $group: {
        //groups the filtered document based on id
        //_id: null,
        _id: '$difficulty',
        numRatings: { $sum: '$ratingsQuantity' },
        numTours: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minprice: { $min: '$price' },
        maxprice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 }, //sorts the grouped document in ascending order (1 means ascending)
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: { tourStats },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', //unwinds the startDates array //Create seperate object for each date
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' }, //groups the document based on month
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' }, //adds a new field to the grouped document
    },
    {
      $project: { _id: 0 }, //removes the _id field
    },
    {
      $sort: { numTourStarts: -1 }, //sorts the grouped document in descending order
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

//ROUTE HANDLERS
exports.getAllTours = catchAsync(async (req, res, next) => {
  console.log(req.requestTime);
  console.log(req.query);
  console.log(Object.keys(req.query)[0]);

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
});

exports.getTour = catchAsync(async (req, res, next) => {
  // console.log(req.query);
  console.log(req.params);

  // const tour = await Tour.findById(req.params.id);
  //Tour.findOne({ _id: req.params.id }
  const tour = await Tour.findById(req.params.id);
  //Tour.findOne({ _id: req.params.id }) //what mongoose does to find the element in bg
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: tour,
  });
});

// #code 1
// exports.createTour = async (req, res) => {
//   console.log(req.body);
//   // const testTour = new Tour({})
//   // testTour.save();

//   try {
//     const newTour = await Tour.create(req.body);
//     res.status(201).json({
//       status: 'success',
//       data: {
//         tour: newTour,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

// #code 2
//Code 2 is essentially a refactoring of Code 1 to make it more concise and to handle errors in a consistent way
/*
Before the actual tour creation logic is executed, the CatchAsync middleware is invoked. 
This middleware is a higher-order function that takes an asynchronous function as an argument 
(in this case, the async (req, res, next) => { ... } function).
The purpose of this middleware is to handle any errors that might occur during the execution of the inner function
*/
/*
If an error occurs during tour creation, it is caught by the CatchAsync middleware.
The middleware then forwards the error to the global error-handling middleware 
*/

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    //mongoose method to update the tour in the DB
    //new: true returns the updated document, runValidators: true runs the validators again
    //if the validators fail, the update will not be applied and the error will be thrown
    //if the validators pass, the update will be applied and the new document will be returned
  });
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
