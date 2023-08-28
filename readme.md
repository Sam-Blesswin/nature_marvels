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