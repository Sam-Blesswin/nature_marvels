const jwt = require('jsonwebtoken');
const util = require('util'); //node builtin package
const crypto = require('crypto');

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

const cookieOptions = {
  expires: new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000, //in milliseconds
  ),
  httpOnly: true,
};
if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id); //sign the token with the user id (user._id)
  console.log(token);

  //send jwt as cookie
  res.cookie('jwt', token, cookieOptions);

  user.password = undefined; //To avoid password being sent to client while signup

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
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
  createAndSendToken(newUser, 201, res); //send the token to the client
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

  createAndSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //check whether token is available
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
  //jwt.verify : checks whether the token is valid or not
  //also checks whether the token has expired or not
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
  //decoded.iat : timestamp when JWT token was issued (issued at)
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

exports.resetPassword = catchAsync(async (req, res, next) => {
  //Get user based on the token
  console.log(req.params.token);
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gte: Date.now() },
  });
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  //If token has not expired, and there is a user, set the new password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  //Update changedPasswordAt property for the user
  await user.save();

  //send JWT
  createAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //const { user } = req; //cannot get user.password directly from user object because in password `select` field it set to false
  //so we need to include password field in the query
  const user = await User.findById(req.user.id).select('+password'); //password is now selected
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('Incorrect password', 401));
  }
  user.password = req.body.newPassword;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  createAndSendToken(user, 200, res);
});
