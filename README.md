# personal-finance-tracker
A React and Spring Boot application with JWT-based user registration and login.
The dashboard is currently a UI scaffold; transaction management is not yet
connected to a backend API.

## Features
- User registration and login
- BCrypt password hashing and JWT authentication
- Protected '/api/**' routes
- React Context for auth state and token handling
- Dashboard and transaction-list placeholders

## Tech Stack
- Frontend: React, Vite
- Backend: Java, Spring Boot, Spring Security
- Database: MongoDB Atlas
- Authentication: JWT

## Requirements
- Java 25 or a compatible newer JDK
- Node.js and npm
- MongoDB Atlas database

## Configuration
Do not commit database credentials or JWT secrets.

### Backend
Set these environment variables in the terminal used to start Spring Boot:
(MongoDB Atlas connection string - mongodb+srv://fintrack_db:<db_password>@fintrack-cluster.a9pqw6m.mongodb.net/)

- 'MONGODB_URI': ${MONGODB_URI:mongodb+srv://fintrack_db:<db_password>@fintrack-cluster.a9pqw6m.mongodb.net/personal_finance_tracker?retryWrites=true&w=majority}

- 'JWT_SECRET': A randomly generated Base64 secret made from at least 32 random bytes
		$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
		$bytes = New-Object byte[] 32
		$rng.GetBytes($bytes)
		$env:JWT_SECRET = [Convert]::ToBase64String($bytes)
		$rng.Dispose()	

- 'CLIENT_ORIGIN': http://localhost:5174


### Frontend
In 'AuthContext.jsx':
    VITE_API_URL=http://localhost:8080

## Run Locally
Start the backend from 'server':
    .\mvnw.cmd spring-boot:run

Start the frontend from 'client' in another terminal:
    npm.cmd install
    npm.cmd run dev

Open the URL printed by Vite.

## Authentication API
- 'POST /api/auth/register' — create an account
- 'POST /api/auth/login' — sign in and receive a JWT
- 'GET /api/auth/me' — return the authenticated user's email; requires a Bearer token
- Other '/api/**' routes require authentication

## Checks
From 'server':
	To confirm 'JWT_SECRET' creation
	if($env:JWT_SECRET){
    		"JWT_SECRET created successfully"
	}else{
    		"JWT_SECRET is missing"
	}

From 'server':
    .\mvnw.cmd test

From 'client':
    npm run lint
    npm run build
