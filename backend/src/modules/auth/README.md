# Auth Module

This module handles user authentication and authorization.

## Features
- User Login (JWT based)
- Role-based Access Control (RBAC) middleware
- Password Hashing (Bcrypt)

## Endpoints
- `POST /api/auth/login`: Authenticate user and return token.
- `POST /api/auth/logout`: Invalidate session (client-side).

## Middleware
- `authenticate`: Verifies the JWT token in the `Authorization` header.
- `authorize(roles)`: Restricts access to specific roles (e.g., 'Admin', 'Manager', 'Technician').

## Schema (Users Table)
- `id`: Primary Key
- `username`: Unique username
- `password`: Hashed password
- `full_name`: User's display name
- `role`: One of 'Student', 'Admin', 'Technician', 'Manager'
- `department`: User's department
