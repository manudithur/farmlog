# User Authentication Service

This project is a user authentication service implemented using ExpressJS, TypeScript, Mongoose (with MongoDB), JWT (JSON Web Tokens) for authentication, bcrypt for password hashing, and Joi for request validation.

## Features

- User registration and login.
- Password hashing with bcrypt.
- JWT authentication for protected routes.
- Request data validation with Joi.

## Requirements

- Node.js
- MongoDB
- npm

## Installation

1. **Install dependencies:**

   Using npm:
   ```
   npm install
   ```

2. **Set up your environment variables:**

   Create a `.env` file in the root of your project and add the following:

   ```env
   JWT_SECRET=123456789
   PORT=3000
   ```
   
   Replace the `JWT_SECRET` with your own secret key.

3. **Set up MongoDB connection**

   Replace with your DB url `MONGO_URI` variable in `/src/db/config.ts`

## Running the Application

Start the server with:

```bash
npm run dev
```

The server will run on `http://localhost:{{PORT}}` by default.

## API Endpoints

- `POST /users`: Register a new user.
- `POST /users/login`: Authenticate a user and return a JWT.
- `GET /users/:id`:  Gets a user profile (Requires Bearer token)

## Technologies

- **ExpressJS**: Web application framework for Node.js.
- **TypeScript**: A superset of JavaScript that adds static types.
- **Mongoose**: MongoDB object modeling tool.
- **JWT**: For securely transmitting information between parties as a JSON object.
- **bcrypt**: For hashing passwords.
- **Joi**: For data validation.

## Project Structure

- `src/controllers`: Contains user controller with authentication logic.
- `src/models`: Mongoose models for user data.
- `src/routes`: Express routes defining the API endpoints.
- `src/validator`: Middleware for validation and other purposes.
- `src/db`: MongoDB conection details.
