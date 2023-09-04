const app = require('./app');

//START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
