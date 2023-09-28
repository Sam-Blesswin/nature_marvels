//Function Composition
//try catch block wrapper

// eslint-disable-next-line arrow-body-style
module.exports = (fn) => {
  // console.log('Catch Async Middleware called');
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
