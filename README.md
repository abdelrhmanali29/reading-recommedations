Readings Recommendation API
===========================

About
-----

The **Readings Recommendation API** is a web application that allows users to:

1.  Register and log in with role-based authentication and authorization.
2.  Manage books, including creation, deletion, and retrieval of paginated lists.
3.  Record and view reading intervals for books.
4.  Retrieve the top five most-read books based on unique reading intervals.

It is built with **Node.js**, **NestJS**, **PostgreSQL**, and **TypeORM**, featuring a modular architecture for scalability and maintainability.

* * * * *

Features
--------

1.  **Authentication and Authorization**:

    -   Role-based access control: `ADMIN` and `USER`.
    -   JWT for secure token-based authentication.
2.  **Books Management**:

    -   Create, delete, and fetch paginated lists of books.
    -   Get the top five most-read books based on unique reading intervals.
3.  **Reading Intervals**:

    -   Log reading intervals for specific books.
    -   Validate against the total number of book pages.
4.  **Rate Limiting**:

    -   Protect endpoints with throttling to prevent abuse.
5.  **Database**:

    -   PostgreSQL database for persistent storage of user, book, and reading interval data.

* * * * *

Prerequisites
-------------

Ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Docker](https://www.docker.com/) and Docker Compose


Running the Application
-----------------------

### 1\. Clone the Repository

```
git clone https://github.com/your-repo/readings-recommendation.git\

cd readings-recommendation
```

### 2\. Environment Setup

Create an `.env` file in the project root with the following variables:
```
NODE_ENV=development\
DATABASE_URL=postgres://user:password@db:5432/readings_recommendation\
JWT_ACCESS_SECRET=your_secret_key\
JWT_EXPIRES_IN=3600\
SALT=10
```
### 3\. Start with Docker Compose

Build and start the services using Docker Compose:
```
docker-compose up --build
```
-   The API will be accessible at `http://localhost:3020`.
-   PostgreSQL will be available at `localhost:5433`.

### 4\. Database Initialization

Once the containers are running, connect to the PostgreSQL container and run migrations if required. Alternatively, TypeORM will handle schema synchronization based on your entities.


Project Structure
-----------------
```
src
├── app.module.ts               # Main application module
├── modules
│   ├── auth                    # Authentication module
│   ├── users                   # User management module
│   ├── books                   # Book management module
│   ├── readings                # Reading intervals module
├── shared                      # Shared utilities and classes
├── config                      # Configuration files
├── main.ts                     # Application entry point
```

API Documentation
-----------------

The application is versioned (`v1`) and follows RESTful principles. Below is a summary of key endpoints:

### Auth

-   **Register**: `POST /v1/auth/register`
-   **Login**: `POST /v1/auth/login`

### Books

-   **List Books (Paginated)**: `GET /v1/books`
-   **Create Book**: `POST /v1/books` (Admin only)
-   **Delete Book**: `DELETE /v1/books/:id` (Admin only)
-   **Get Top 5 Books**: `GET /v1/books/top-five`

### Reading Intervals

-   **Create Reading Interval**: `POST /v1/readings` (User only)

* * * * *

Testing
-------

To run tests (if available):
```
npm run test
````

Deployment
----------

For deployment, ensure the `.env` file is correctly configured for the production environment. Use a production-grade PostgreSQL database and secure secrets.