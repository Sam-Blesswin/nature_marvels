# Backend Developer Guide

## How the Web Works?

### Request - Response Cycle / Client - Server Architecture

1. **DNS**
   When you enter a URL into the browser's address bar, the browser parses the URL to identify the protocol (e.g., HTTP or HTTPS), domain, and path. It then performs DNS (Domain Name System) resolution to find the IP address associated with the domain.

2. **TCP/IP Socket Connection**

   - **TCP Handshake**
     - SYN: The browser sends a SYN (synchronize) packet to the server, indicating its intention to start a connection.
     - SYN-ACK: The server responds with a SYN-ACK packet, acknowledging the browser's request and indicating its readiness to establish the connection.
     - ACK: The browser sends an ACK (acknowledge) packet back to the server, confirming the connection establishment.

3. **HTTP Request**
   The browser establishes a connection to the web server using the resolved IP address and sends an HTTP request for the webpage's resources. These resources include HTML, CSS stylesheets, JavaScript files, images, and more.

4. **HTTP Response**
   The web server processes the HTTP request and sends back an HTTP response. This response contains the requested resources, along with metadata like headers and status codes.

### Why HTTPS is secure?

- HTTPS (Hypertext Transfer Protocol Secure) is secure because it uses encryption to protect the data transmitted between a user's browser and the website's server.

### Cookies

Cookies are small pieces of data stored on your computer by websites. They remember things like your preferences, login status, and items in your shopping cart, making your online experience smoother. Cookies are primarily used to store user-specific data, such as login credentials, user preferences, and tracking information.

### Browser Cache

The browser cache stores resources like images, stylesheets, scripts, and other web content to improve loading times by reducing the need to re-download resources from the web server. Cached resources are used to fulfill subsequent requests for the same content, reducing server load and improving load times.

## Node.js

Node.js allows running JavaScript on the server-side.

- **V8 Engine**: Converts JavaScript to machine code.
- **libuv**: Gives JavaScript access to OS functions, network operations, etc.

### Event Loop in Node.js

**Technical Explanation**:

In Node.js, the event loop is the heart of its asynchronous behavior. It's like a loop that continuously checks if there are tasks to be done. When a task like a file read or a network request is started, instead of waiting for it to finish, Node.js moves on to do other tasks while keeping track of the unfinished ones. Once the task is complete (like the file is read), its associated callback is put into a queue.

## EventLoop:

1. Node.js starts a task, say, reading a file.
2. While waiting for the file to be read, Node.js doesn't sit idle. It continues executing other tasks that can run concurrently.
3. When the file reading is done, the callback for that task is put in the queue.
4. Node.js, through the event loop, checks the queue for completed tasks and executes their callbacks.

Yes, in Node.js, when a task like reading data from a file is initiated, the actual low-level reading of data is typically handled by threads managed by the operating system's I/O subsystem. Node.js leverages the operating system's capabilities to perform I/O operations efficiently, while its event-driven architecture and single main thread manage the scheduling and execution of tasks.

Here's how it generally works:

1. **Task Initiation**: When you initiate a task like reading data from a file in Node.js, it's scheduled in the event loop's task queue.

2. **Operating System Involvement**: Node.js hands off the I/O task to the underlying operating system's I/O subsystem. The operating system uses its own mechanisms, which may involve utilizing threads from a thread pool, to perform the low-level I/O operation like reading data from storage devices.

3. **Non-Blocking Operation**: While the operating system's I/O subsystem is performing the actual data reading, Node.js's main thread doesn't wait for this operation to complete. Instead, it can continue executing other tasks that are ready to be processed.

4. **Callback Execution**: Once the operating system's I/O operation is complete, the associated callback function is placed in Node.js's event loop callback queue.

5. **Main Thread Execution**: When the main thread becomes available, it picks up the callback from the callback queue and executes it, processing the results of the I/O operation.

This separation of responsibilities allows Node.js to efficiently manage multiple I/O operations concurrently, even though it runs in a single thread. The operating system handles the low-level I/O operations, freeing up Node.js's main thread to focus on task scheduling, callback execution, and managing the event loop. This is a key factor in Node.js's ability to handle high levels of concurrency and I/O-intensive tasks.

## Event Driven Architecture

- Events are emitted
- Event loops picks them up
- callbacks are called

# Nature Marvel

A sample project to learn backend tech stack (Express - Node - MongoDB)

To run the project in development mode: npm run start:dev

    "start:dev": "npm run start:dev",

    "start:prod": "SET NODE_ENV=production&& start:prod",

package.json is configured to run "npm --watch server.js"

## To Get Started

Have your own mongoDb setup with credentials and config.env file

## Packages

### Express

command : "npm i express"

Express is a node.js framework with high level of abstraction.

### Morgan

command : "npm i morgan"

morgan is a popular middleware for Node.js web applications, primarily used for HTTP request logging. It provides a simple and customizable logging solution that can be easily integrated into Express.js or other Node.js frameworks.

### Dotenv

command : "npm i dotenv"

The dotenv npm package is used to load environment variables from a .env file into Node.js applications, simplifying the management of configuration settings.

### ESLint

command : "npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev"

ESLint is a customizable linter that enforces code style and identifies errors.It can be configured with various rulesets to fit the specific requirements of a project.

### Prettier

Prettier is a code formatter that ensures consistent formatting.

### Mongoose

command : npm i mongoose

Mongoose simplifies working with MongoDB databases by providing an object modeling framework and tools for data validation, querying, and manipulation.

### Slugify

command : npm i slugify

The slugify package is used to convert text into a URL-friendly format (slug) by replacing spaces and special characters with hyphens or underscores, making it suitable for use in website URLs.

### validator

command : npm i validator

validator package is a widely-used library for validating and sanitizing strings in JavaScript.

### NDB

command : npm i ndb

ndb is a powerful debugging tool for Node.js applications, developed by Google.

## CRUD : HTTP METHODS

REST Methods

- CREATE : POST
- READ : GET
- UPDATE : PUT / PATCH
- DELETE : DELETE

## Endpoints

In an API, an endpoint is a URL that clients can use to request information or perform an action. It's like a door or entrance to access a specific resource or feature of the API.

Here are some examples of API endpoints:

GET /users - This endpoint lets clients retrieve a list of users from the API. For instance, a client can request this endpoint to get a list of users' names, emails, and other details.

POST /users - This endpoint is used to create a new user in the API. The client sends a POST request with the new user's details, such as name and email, and the API responds with a success message.

PUT /users/{id} - This endpoint updates an existing user's details in the API. The client sends a PUT request with the user's ID and updated details, and the API responds with a success message.

DELETE /users/{id} - This endpoint deletes an existing user from the API. The client sends a DELETE request with the user's ID, and the API responds with a success message.

## Response codes

- 200 - Success
- 201 - Created
- 204 - No Content
- 400 - Bad Request
- 404 - Not Found
- 500 - Internal Server Error

## Middleware

Middlewares in HTTP servers are functions that process requests before they reach the final handler function. They are used to extract data from the request, authenticate the request, or perform other pre-processing tasks. They are called "middlewares" because they sit in the middle between the request and the final handler function.

Middleware stack
When a request is received by a server, it passes through the middleware stack, where each middleware function can modify the request or response objects, perform additional processing, or invoke the next middleware function in the stack. This allows for modular and reusable code that can handle common tasks such as authentication, logging, error handling, and more.

Order of Execution
In Node.js, middleware functions are executed in the order they are defined or added to the application's middleware stack. The order of execution is important as it determines how the request flows through the middleware functions and how each middleware can manipulate the request and response objects.

## MongoDb Schema

MongoDB schema is a flexible structure that defines the organization and layout of data stored in MongoDB. It consists of collections, documents, and fields, allowing for dynamic and schema-less data modeling.

### Document Middleware

It provides a way to intercept and modify data before it's saved to or retrieved from the database. It's useful for tasks like data validation, security measures, etc.., making it easier to customize data handling logic within your application's database interactions.

### Query Middleware

It allows you to intercept and modify database queries before they are executed. It's useful for tasks like adding additional criteria to queries, implementing access control, or logging query activity. Query middleware helps you customize and enhance the behavior of database queries within your application.

### Aggregate Middleware

It allows you to intercept and modify the aggregation pipeline before it's executed. It's useful for tasks like data transformation, filtering, and adding custom stages to the aggregation process.

## MVC Architecture

MVC (Model-View-Controller) is a design pattern used in backend programming to organize code into three components:

1. Model: Represents the data and business logic. It interacts with the database and defines the structure of the data.

2. View: Displays the data to the user. It generates the user interface and presents the information in a format that users can understand.

3. Controller: Handles user input and acts as a mediator between the Model and View. It receives requests from the user, retrieves or updates data from the Model, and updates the View accordingly.

For example, in a user registration system:

- Model: Defines the user data structure, validates input, and saves/retrieves data from the database.

- View: Displays the registration form and shows success/error messages to the user.

- Controller: Handles the registration request, validates the input, creates a new user record in the Model, and updates the View to show the appropriate response.

Using MVC helps separate concerns, makes code modular and easier to maintain, and enables multiple views to interact with the same underlying data without affecting each other.

## Error Handling

Debugger : Installed ndb package to debug code.

Handling runtime operational errors : Problems that we can predict might happen, so we need to handle it in advance.

By Setting up a global error handling middleware.
