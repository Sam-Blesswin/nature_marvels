const mongoose = require('mongoose');

//Schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true, //removes whitespace from the beginning and end of the string; only works for string
    required: [true, 'A tour must have a summary'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String, //we only store the name of the image, not the image itself; we will use the name to retrieve the image from other place
    required: [true, 'A tour must have a cover image'],
  },
  images: [String], //array of strings to store multiple image names
  createdAt: {
    type: Date,
    default: Date.now(), //to automatically set the date when a new tour is created
    select: false, //to hide the date from the client side
  },
  startDates: [Date], //array of dates
});

//Model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
