# Classroom Management System

A full-stack web application for managing classrooms, assignments, submissions, results, and announcements.

## Overview

Classroom Management System provides separate workflows for teachers and students.

Teachers can create and manage classrooms, publish assignments and announcements, review submissions, and manage results.

Students can join classrooms, view assignments and announcements, submit their work, and view their results.

## Features

### Teacher

- Teacher authentication
- Create and manage classrooms
- Create assignments
- View student submissions
- Grade submissions
- Publish classroom announcements
- Delete announcements
- View analytics

### Student

- Student authentication
- View joined classrooms
- View classroom details
- View announcements
- View assignments
- Submit assignments
- View results and feedback

## Tech Stack

### Frontend

- React
- React Router
- JavaScript
- CSS
- Vite
- Axios

### Backend

- Python
- Flask
- Flask-JWT-Extended
- Flask-SQLAlchemy
- SQLite

### Testing & Tools

- Pytest
- Git
- GitHub

## Project Structure

```text
classroom-management-system/
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── extensions.py
│   │   ├── config.py
│   │   └── __init__.py
│   ├── tests/
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── routes/
│   └── package.json
│
├── .gitignore
├── .env.example
├── docker-compose.yml
└── README.md