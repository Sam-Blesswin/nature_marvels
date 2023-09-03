const fs = require('fs');
const express = require('express');
const app = express();
app.use(express.json()); //middleware

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: tours,
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
    const tour = tours.find(el=>el.id===req.params.id)
    res.status(200).json({ 
        status: 'success',
        data: tour
    })
})

app.post('/api/v1/tours', (req, res) => {
  console.log(req.body);
  res.status(201).json({
    status: 'success',
    data: 'tour created',
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
