class APIFeatures {
  constructor(queryReq, query) {
    this.queryReq = queryReq;
    this.query = query;
  }

  Filter() {
    //1) Filtering
    const queryObj = { ...this.queryReq }; //deep copy,copy by value not by reference
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    //2)Advanced filtering
    let queryStr = JSON.stringify(queryObj); //convert the queryObj to a string
    //{difficulty:'easy',duration:{$gte:5}} //mongodb querying syntax.
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); //Add the operators with $ operators
    console.log(JSON.parse(queryStr)); //convert the string to an object

    this.query = this.query.find(JSON.parse(queryStr)); //find the tours based on the queryStr

    return this; //return this object to allow chaining of methods.
  }

  Sort() {
    if (this.queryReq.sort) {
      const sortBy = this.queryReq.sort.split(',').join(' '); //sort by multiple fields
      //console.log(sortBy);
      //sort('price ratingAverage') //mongodb sorting syntax based on price and if same price then based on avg.
      this.query = this.query.sort(sortBy);
    } else {
      //default sorting
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  LimitFields() {
    if (this.queryReq.fields) {
      const fields = this.queryReq.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); //exclude the __v field
    }
    return this;
  }

  Paginate() {
    //page=3&limit=10, 1-10 page 1, 11-20 page 2, 21-30 page 3
    const page = this.queryReq.page * 1 || 1; //default page is 1 if no page is passed
    const limit = this.queryReq.limit * 1 || 100; //default limit is 100 if no limit is passed
    const skip = (page - 1) * limit; //skip the first 10 results

    this.query = this.query.skip(skip).limit(limit); //skip the first 10 results and limit the result to 10
    return this;
  }
}

module.exports = APIFeatures;
