const AppError = require('../utils/appError');

const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  //Operationl, trusteted error : send to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  //Programming or other unknown error: don't leak error details
  else {
    //Log Error
    console.error('ERROR ', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

const handleCastErrorDB = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateErrorDB = (err) =>
  new AppError(`Duplicate field value: ${err.keyValue.name}`, 400);

const handleValidationErrorDB = (err) => {
  //console.log(`Validation Error : ${Object.values(err.errors)}`);
  const errors = Object.values(err.errors);
  const message = `Invalid input data. ${errors}`;
  return new AppError(message, 400);
};
const handleJwtError = () =>
  new AppError('Invalid Token. Please login again', 401);

//global error handler
//err comes from the App Error
//AppError class is inherited from the built-in Error class, which sets the name, code.. property based on the type of error.
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err }; //Copying the error object
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    else if (err.code === 11000) error = handleDuplicateErrorDB(error);
    else if (err.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    else if (err.name === 'JsonWebTokenError') error = handleJwtError();
    else if (err.name === 'TokenExpiredError') error = handleJwtError();
    sendErrorProd(error, req, res);
  }
};

// Errors Created by mongoose
// 1.Invalid Database ID
// 2.Duplicate Key (validation error)
// 3.Invalid value (validation error)
