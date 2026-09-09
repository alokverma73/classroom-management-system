# System Architecture

## Overview

The Classroom Management System follows a client-server architecture.

The application consists of:

- React frontend
- Flask backend
- REST API
- Relational database
- JWT-based authentication

## Frontend

The frontend is built with React.

Main responsibilities:

- User interface
- Authentication screens
- Student dashboard
- Teacher dashboard
- Classroom management
- Assignment management
- Assignment submissions
- Results
- Announcements
- Analytics

## Backend

The backend is built with Flask.

Main responsibilities:

- Authentication
- User management
- Classroom management
- Assignment management
- Submission management
- Result management
- Announcement management
- API request handling
- Database operations

## API

The frontend communicates with the backend through REST APIs.

Base URL:

```text
http://127.0.0.1:5000/api