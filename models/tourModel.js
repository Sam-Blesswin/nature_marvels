const mongoose = require('mongoose');

//Schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: Number,
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

//Model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
