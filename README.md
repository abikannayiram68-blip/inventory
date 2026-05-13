# Room Booking & Resource Management System

A beginner-friendly full-stack project for learning Node.js, Express, MySQL, Sequelize, JWT authentication, migrations, React, protected routes, and CRUD flows.

## Tech Stack

* Backend: Node.js, Express.js, MySQL, Sequelize, JWT, bcrypt
* Frontend: React, React Router, Axios, Vite

## Project Structure

```text
backend/
  src/
    config/
    controllers/
    middlewares/
    migrations/
    models/
    routes/
    seeders/
    services/
    utils/
frontend/
  src/
    api/
    components/
    context/
    pages/
    styles/
docs/
postman/
```

## Setup

1. Create a MySQL database:

```sql
CREATE DATABASE room_booking_dev;
```

2. Configure backend environment:

```bash
cd backend
cp .env.example .env
```

Update `.env` with your MySQL username and password.

3. Install dependencies:

```bash
npm run install:all
```

4. Run migrations and seed data:

```bash
cd backend
npm run db:migrate
npm run db:seed
```

5. Start both apps:

```bash
npm run dev
```

* API: `http://localhost:5000/api`
* Frontend: `http://localhost:5173`

## Demo Users

Seed data creates:

* Admin: `admin@company.com` / `Admin@1234`
* Employee: `employee@company.com` / `Employee@123`

## Key API Routes

* `POST /api/auth/register`
* `POST /api/auth/login`
* `GET /api/rooms`
* `POST /api/rooms`
* `GET /api/resources`
* `POST /api/resources`
* `POST /api/bookings`
* `GET /api/bookings`
* `PATCH /api/bookings/:id/status`
* `PATCH /api/bookings/:id/cancel`

## Learning Notes

* Controllers only handle HTTP request and response.
* Services contain business rules.
* Middleware handles authentication, authorization, validation errors, and unknown errors.
* Sequelize migrations describe database history.
* The booking/resource relationship uses a many-to-many join table.

## Unit Testing

This project also includes beginner-friendly unit testing using Jest.

### Testing Stack

* Jest
* Supertest (for API testing)
* Mock functions/services

### Run Tests

Go to backend folder:

```bash
cd backend
```

Run all test cases:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

### Example Tested Modules

* Authentication Service
* Room Service
* Resource Service
* Booking Service
* Middleware Validation
* Protected Routes

### Test Folder Structure

```text
backend/
  tests/
    controllers/
    services/
    middlewares/
```

### What is Covered

* User login validation
* JWT authentication
* Room CRUD operations
* Booking creation and cancellation
* Resource allocation logic
* Error handling and edge cases

### Learning Notes for Testing

* Unit tests verify individual functions/modules.
* Mocking is used to isolate database and external dependencies.
* Service layer testing helps validate business logic independently.
* Automated tests improve code reliability and reduce bugs during future changes.

See [docs/schema.md](docs/schema.md) for the database schema summary.
