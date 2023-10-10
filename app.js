const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

//MIDDLEWARES
//Set security HTTP header
app.use(helmet());

//Development logging
if (process.env.NODE_ENV === 'development') {
  console.log('development mode');
  app.use(morgan('dev'));
}

//Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, //1hr
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter); //apply limiter to all routes starting with /api

//Body parser, reading data from the body into req.body
app.use(
  express.json({ limit: '10kb' }), //limits to accept only 10kb of data
); /**this middleware takes that incoming JSON format data and converts it into a JavaScript object */

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//prevent parameter pollution
//in req query params: ?sort=duration&sort=price it only consider the last (sort = price)
//but in some cases: ?duration=5&duration=10 we need both data with duration to be 5 and 10 //can be achieved with whitelist
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

//serving static files
app.use(
  express.static(`${__dirname}/public`),
); /**this middleware serves static files */

//Test middleware
app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

//Middleware to add requestedTime property to every request
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
