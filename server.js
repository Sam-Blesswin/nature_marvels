const mongoose = require('mongoose');

//enviroment variables
const dotenv = require('dotenv');

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
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
