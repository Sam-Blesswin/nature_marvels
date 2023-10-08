const jwt = require('jsonwebtoken');
const util = require('util'); //node builtin package
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendMail = require('../utils/email');

const signToken = (id) => {
  const _token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return _token;
};

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  }); //creating a new user only with the data we want

  const token = signToken(newUser._id); //sign the token with the user id (newUser._id)
  console.log(token);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email: email }).select('+password'); //select password to compare with the password we send
  console.log(user);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //check whether is available
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log(`Token: ${token}`);
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }
  //verigy token
  //jwt.verify is a synchronous function
  //The promisify() function will return a version Promise of your function
  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET,
  );
  console.log(`Decoded Token:${JSON.stringify(decoded)}`);

  //check if user still exists
  const _user = await User.findById(decoded.id);
  if (!_user) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );
  }

  //check if user changed password after the token was issued
  //decoded.iat : timestamp when JWT token was issued
  if (_user.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401),
    );
  }

  req.user = _user; //add user to the request object
  next();
});

//To pass arguments to middleware
exports.restrictTo = function (roles) {
  return catchAsync(async (req, res, next) => {
    if (req.user.role !== roles) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  });
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email address', 404));
  }
  //create token
  const token = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //send email
  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/resetPassword/${token}`;

  try {
    await sendMail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message: `Hello ${user.name}, \n\nYour password reset token is: ${token}. Submit a patch request with your new password to: 
      ${resetURL}.\n\nIf you did not request this, please ignore this email.`,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500,
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {});
