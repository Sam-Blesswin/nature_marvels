const mongoose = require('mongoose');
const slugify = require('slugify');

//Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
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
    startDates: [Date], //array of dates,
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true }, //to show virtual properties in the client side
    toObject: { virtuals: true },
  },
);

//Virtual properties
/*we are not actually storing the data in the database, we are getting the data from the database and doing the calcualtion
on the fly*/
/*Need a real function instead of a arrow function: arrow function does not bind the 'this' keyword*/
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//DOCUMENT MIDDLEWARE: runs before .save() and .create()
//We are using pre because we want to run this function before the document is saved to the database
tourSchema.pre('save', function (next) {
  //slug is the name of the field in the database
  this.slug = slugify(this.name, { lower: true });
  next();
});
//We are using post because we want to run this function after the document is saved to the database
// tourSchema.post('save', (doc, next) => {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE: runs before .find() and .findOne()
//hiding the secret tours
///^find/ means that the function will run only for queries that start with the word find
tourSchema.pre(/^find/, function (next) {
  //tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now(); //to measure the time taken to run the query
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  console.log(docs);
  next();
});

//Model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
