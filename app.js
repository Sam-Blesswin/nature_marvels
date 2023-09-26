const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

//MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  console.log('development mode');
  app.use(morgan('dev'));
}

app.use(
  express.json(),
); /**this middleware takes that incoming JSON format data and converts it into a JavaScript object */

app.use(
  express.static(`${__dirname}/public`),
); /**this middleware serves static files */

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//UNHANDLED ROUTES
//.all method is used to handle all HTTP requests
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404)); //automatically calls the global error handler
  //because AppError is a subclass of Error
});

//Global Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
