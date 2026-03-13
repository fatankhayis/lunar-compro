# Lunar-Compro API

## Description

Lunar-Compro API is a RESTful backend built with Laravel to support the Lunar company profile application. It provides endpoints for managing projects, products, crews, partners, testimonials, and categories.

The API follows Laravel best practices including database migrations, Eloquent ORM, request validation, and token-based authentication. It is designed to be easily integrated with web, SPA, or mobile applications while maintaining a clean and scalable architecture.

## Tech Stack

- Laravel (PHP Framework)
- PHP
- MySQL (Relational Database)
- Composer
- JWT Authentication
- Spatie Laravel Analytics
- Google Analytics Data API
- RESTful API Architecture

## Features

- RESTful API architecture with JSON responses
- JWT-based authentication and authorization
- CRUD operations for projects, products, crews, partners, testimonials, and categories
- Public and protected API endpoints
- Database migrations and seeders for structured data management
- Request validation and structured error handling
- Consistent API response format
- Integration with Google Analytics using Spatie Laravel Analytics

## Installation

1. Clone the repository
   git clone https://github.com/raihanshi18/Lunar-Compro.git
   cd Lunar-Compro

2. Install PHP dependencies
   composer install

3. Copy and configure environment  
   cp .env.example .env  
   - Set DB_CONNECTION, DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD  
   - Configure APP_URL and other application keys as needed  
   - Set JWT_SECRET and JWT_ALGO for JWT authentication  
   - Configure ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD for the default admin account  
   - Set ANALYTICS_PROPERTY_ID for Google Analytics integration  
   - For Laravel Analytics setup, please refer to the official Spatie Laravel Analytics documentation: https://github.com/spatie/laravel-analytics

4. Generate application key
   php artisan key:generate

5. Run migrations (and seeders if needed)
   php artisan migrate
   php artisan db:seed         # optional

### MySQL (Laragon) quick setup

- Create a database (example: `lunar_compro`) in phpMyAdmin / HeidiSQL.
- Ensure your `.env` has `DB_CONNECTION=mysql` and the matching credentials.
- Then run `php artisan migrate` (and `php artisan db:seed` if needed).

6. Start the development server
   php artisan serve

## Serving the React Front-End (Production)

This repo also contains a separate React app in `Front-End/`. For a single deployment, the React build is configured to output into `Back-End/public/app` and Laravel serves `public/app/index.html` for all non-`/api` routes.

1. Build the React app into Laravel public folder
   - From `Back-End/`:
     - `npm run build:spa`
   - Or from `Front-End/`:
     - `npm run build`

2. Run Laravel normally
   - `php artisan serve`

Notes:
- API calls in React default to same-origin (`/api/...`). If you run FE dev server separately, set `VITE_BACKEND_URL=http://127.0.0.1:8000` in `Front-End/.env`.

7. (Optional) Set up API authentication
   - For Sanctum: follow Laravel Sanctum installation and middleware setup
   - For Passport: php artisan passport:install and configure

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|------|------|------|------|
| POST | /api/login | Authenticate user and get token | No |
| POST | /api/logout | Logout current user | Yes |
| POST | /api/refresh | Refresh authentication token | Yes |
| GET | /api/remaining | Get remaining session/token info | Yes |

---

### Projects

| Method | Endpoint | Description | Auth |
|------|------|------|------|
| GET | /api/projects | Get all projects | No |
| GET | /api/projects/order | Get ordered projects | No |
| GET | /api/projects/{project_id} | Get project detail | No |
| POST | /api/projects | Create new project | Yes |
| POST | /api/projects/{project_id} | Update project | Yes |
| DELETE | /api/projects/{project_id} | Delete project | Yes |

---

### Products

| Method | Endpoint | Description | Auth |
|------|------|------|------|
| GET | /api/products | Get all products | No |
| GET | /api/products/order | Get ordered products | No |
| GET | /api/products/{product_id} | Get product detail | No |
| POST | /api/products | Create new product | Yes |
| POST | /api/products/{product_id} | Update product | Yes |
| DELETE | /api/products/{product_id} | Delete product | Yes |

---

### Crews

| Method | Endpoint | Description | Auth |
|------|------|------|------|
| GET | /api/crews | Get all crews | No |
| GET | /api/crews/order | Get ordered crews | No |
| GET | /api/crews/{crew_id} | Get crew detail | No |
| POST | /api/crews | Create new crew | Yes |
| POST | /api/crews/{crew_id} | Update crew | Yes |
| DELETE | /api/crews/{crew_id} | Delete crew | Yes |

---

### Partners

| Method | Endpoint | Description | Auth |
|------|------|------|------|
| GET | /api/partners | Get all partners | No |
| GET | /api/partners/{partner_id} | Get partner detail | No |
| POST | /api/partners | Create new partner | Yes |
| POST | /api/partners/{partner_id} | Update partner | Yes |
| DELETE | /api/partners/{partner_id} | Delete partner | Yes |

---

### Testimonials

| Method | Endpoint | Description | Auth |
|------|------|------|------|
| GET | /api/testimonials | Get all testimonials | No |
| GET | /api/testimonials/{testimonial_id} | Get testimonial detail | No |
| POST | /api/testimonials | Create testimonial | Yes |
| POST | /api/testimonials/{testimonial_id} | Update testimonial | Yes |
| DELETE | /api/testimonials/{testimonial_id} | Delete testimonial | Yes |

---

### Categories

| Method | Endpoint | Description | Auth |
|------|------|------|------|
| GET | /api/categories | Get all categories | Yes |
| GET | /api/categories/{category_id} | Get category detail | Yes |
| POST | /api/categories | Create category | Yes |
| POST | /api/categories/{category_id} | Update category | Yes |
| DELETE | /api/categories/{category_id} | Delete category | Yes |

---

### Analytics

| Method | Endpoint | Description | Auth |
|------|------|------|------|
| GET | /api/analytics | Get dashboard analytics data | No |

## Project Structure

- app/              # Models, Policies, Services
- app/Http/Controllers/Api/  # API controllers
- app/Http/Requests/ # Form request validation
- database/migrations/
- database/seeders/
- routes/api.php
- resources/         # API Resources and views (if any)
- tests/             # Feature and unit tests
- composer.json
- .env.example

## Testing

Run automated tests:
php artisan test

## Contributing

- Fork the repository
- Create feature branch: git checkout -b feature/xyz
- Commit changes and open a PR
- Write tests for new features or bug fixes

## Author

- Name: Raihan
- GitHub: https://github.com/raihanshi18

## License

This project is open source and available under the MIT License.
