const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
  },
  email: {
    type: String,
    required: [true, 'A user must have a email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false, //donot send password to client
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //this only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
});

//Document Middleware
//Encrypted Password
userSchema.pre('save', async function (next) {
  //Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  //12 - salt value, hashing cost //bigger the vlaue strong the encryption be
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined; //donot store confirm password in Db
  next();
});

//this method is added to the instance created using schema
//This means that you can call correctPassword on individual user instances,
//like user.correctPassword, but you cannot call it on the User model itself
//because it's not a static method
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    console.log(`${JWTTimestamp}, ${changedTimestamp}`);
    return JWTTimestamp < changedTimestamp;
  }
  return false; //false means not changed
};

const User = mongoose.model('User', userSchema);
module.exports = User;
