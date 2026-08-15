# StorePulse

A full-stack web application where users can discover registered stores and submit ratings from 1 to 5. The application uses role-based access control to provide different features for System Administrators, Normal Users, and Store Owners.

## Live Demo

[StorePluse](https://storepulse-lktx.onrender.com)

## Demo Login Credentials

You can use the following accounts to test different user roles.

### System Administrator

- **Email:** admin@example.com
- **Password:** Admin@123

### Store Owner

**Account 1**

- **Email:** mahesh@gmail.com
- **Password:** Mahesh@123

**Account 2**

- **Email:** owner@example.com
- **Password:** Owner@123

### Normal User

- **Email:** pawarpiyushd007@gmail.com
- **Password:** Piyush@007

## Tech Stack

### Frontend

- React.js
- Vite
- React Router
- Context API
- Axios
- SCSS

### Backend

- Node.js
- Express.js
- JavaScript
- JWT Authentication
- bcrypt

### Database

- PostgreSQL
- Neon
- Redis for token blacklisting

## User Roles

### System Administrator

- View dashboard statistics
- Create users, admins, and store owners
- Create stores
- View and manage users
- View stores and ratings
- Search, filter, sort, and paginate listings
- View user details
- Manage platform data
- Logout

### Normal User

- Register and login
- View all stores
- Search stores by name and address
- Submit ratings from 1 to 5
- Modify submitted ratings
- Change password
- Logout

### Store Owner

- Login
- View their store's average rating
- View users who rated their store
- View store rating information
- Change password
- Logout

## Features

- Role-based authentication and authorization
- Secure password hashing
- JWT authentication using HTTP-only cookies
- Token blacklisting using Redis
- Store rating system
- One rating per user per store
- Search and filtering
- Sorting
- Pagination
- Form validation
- Responsive UI
- PostgreSQL relational database
- Separate functionality for Admin, Normal User, and Store Owner
