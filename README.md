# BlogApp

A full-stack blog web application built with MERN stack (MongoDB, Express, React, Node.js) featuring blog creation, viewing, and management with a responsive UI.

## Features

- User authentication (register, login)
- Create, edit, and delete blog posts
- View blog details
- User dashboard
- Responsive design with Tailwind CSS

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Axios
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT for authentication
- **Database:** MongoDB

## Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally or a MongoDB Atlas account)
- npm or yarn package manager

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Blog-app
   ```

2. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies:**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup:**
   - Create a `.env` file in the `server` directory with the following variables:
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     PORT=5000
     ```

## Running the Application

1. **Start the server:**
   ```bash
   cd server
   npm run dev  # For development with nodemon
   # or
   npm start    # For production
   ```
   The server will run on `http://localhost:5000`.

2. **Start the client:**
   ```bash
   cd client
   npm run dev
   ```
   The client will run on `http://localhost:5173` (default Vite port).

3. Open your browser and navigate to `http://localhost:5173` to view the application.

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/blogs` - Get all blogs
- `POST /api/blogs` - Create a new blog (authenticated)
- `GET /api/blogs/:id` - Get blog by ID
- `PUT /api/blogs/:id` - Update blog (authenticated, author only)
- `DELETE /api/blogs/:id` - Delete blog (authenticated, author only)

## Contributing

Feel free to submit issues and pull requests.

## License

This project is licensed under the ISC License.
