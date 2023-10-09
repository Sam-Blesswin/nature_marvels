//Function Composition
//try catch block wrapper

//By returning a function, you can control when fn is actually executed.
//In this case, fn is not executed immediately when catchAsync is called; instead, it will be executed
//when the returned function is called later. This allows you to wrap error-handling logic around the execution of fn

// eslint-disable-next-line arrow-body-style
module.exports = (fn) => {
  // console.log('Catch Async Middleware called');
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
};
