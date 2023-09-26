//AppError inherits from Express Error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message); //calls the parent class constructor

    //custom properties
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    /*It is typically used inside the constructor function of a custom error class.
     The purpose is to customize the stack trace of the error object being created.

     /*
     By calling Error.captureStackTrace(this, this.constructor), 
     you are telling JavaScript to capture the current call stack and associate it with the this object (the error instance) 
     while omitting the constructor function itself from the stack trace. 
     This results in a cleaner stack trace that starts from where the error was thrown within your code 
     rather than including the internal details of how the error object was constructed.
     */
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
