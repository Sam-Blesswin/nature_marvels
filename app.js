const fs = require('fs');
const express = require('express');
const app = express();

app.use(express.json()); //middleware
/**this middleware takes that incoming JSON format data and converts it into a JavaScript object */

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAlltours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: tours,
  });
};

const getTour = (req, res) => {
  const id = req.params.id * 1; //convert to number
  const tour = tours.find((el) => el.id === id);

  if (!tour)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  res.status(200).json({
    status: 'success',
    data: tour,
  });
};

const createTour = (req, res) => {
  console.log(req.body);
  res.status(201).json({
    status: 'success',
    data: 'tour created',
  });
};

const updateTour = (req, res) => {
  const id = req.params.id * 1; //convert to number
  const tour = tours.find((el) => el.id === id);

  if (!tour)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });

  res.status(200).json({
    status: 'success',
    data: 'tour updated',
  });
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1; //convert to number
  const tour = tours.find((el) => el.id === id);

  if (!tour)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });

  res.status(204).json({ status: 'success', data: null });
};

// app.get('/api/v1/tours', getAlltours);
// app.post('/api/v1/tours', createTour);

// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAlltours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
