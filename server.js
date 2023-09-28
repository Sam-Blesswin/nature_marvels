const mongoose = require('mongoose');

//enviroment variables
const dotenv = require('dotenv');

//HANDLING UNCAUGHT EXCEPTIONS
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION!  Shutting down...');
  process.exit(1); //1 means error
});

dotenv.config({ path: './config.env' });
//console.log(process.env);

const app = require('./app');

//DB connection
const DB = process.env.DATABASE.replace(
  '<DATABASE_PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose.connect(DB).then(() => console.log('DB connection successful'));

//START SERVER
const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//HANDLING UNHANDLED PROMISE REJECTIONS
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION!  Shutting down...');

  //closing server
  server.close(() => {
    process.exit(1); //1 means error
  });
});
