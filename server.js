//enviroment variables
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
//console.log(process.env);

const app = require('./app');

//START SERVER
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
