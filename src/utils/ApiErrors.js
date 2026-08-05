// ApiError is a custom error class that inherits all features of JavaScript's built-in Error class
class ApiError extends Error {

    // Constructor runs automatically whenever we create a new ApiError object
    constructor(
        statusCode,                           // Stores the HTTP status code (400, 404, 500, etc.)
        message = "Something went wrong",     // Default error message if no message is provided
        errors = [],                          // Stores multiple validation or custom errors in an array
        stack = ""                            // Optional custom stack trace (usually left empty)
    ){

        // Calls the parent(Error) constructor and sets the error message
        super(message)

        // Stores the HTTP status code in this object
        this.statusCode = statusCode

        // Error responses usually don't return any data, so data is set to null
        this.data = null

        // Stores the error message inside this object
        this.message = message

        // Indicates that the API request failed
        this.success = false;

        // Stores the array of detailed errors
        this.errors = errors

        // If a custom stack trace is provided...
        if (stack) {

            // ...use that custom stack trace
            this.stack = stack

        } else {

            // Otherwise, automatically generate a clean stack trace
            // 'this' -> current object
            // 'this.constructor' -> ApiError class (removes constructor from stack trace)
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

// Makes ApiError available to import into other files
export { ApiError }