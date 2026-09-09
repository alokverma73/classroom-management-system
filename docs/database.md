# Database Documentation

## Overview

The Classroom Management System uses a relational database to store users, classrooms, assignments, submissions, results, and announcements.

## Main Entities

### User

Stores teacher and student account information.

Fields:
- id
- name
- email
- password
- role

Roles:
- teacher
- student

### Classroom

Stores classroom information created by teachers.

Fields:
- id
- name
- description
- code
- teacher_id
- created_at

### Assignment

Stores assignments created by teachers.

Fields:
- id
- title
- description
- classroom_id
- teacher_id
- due_date
- total_marks
- created_at

### Submission

Stores student assignment submissions.

Fields:
- id
- assignment_id
- student_id
- content
- submitted_at
- status

### Result

Stores grades and feedback for submissions.

Fields:
- id
- submission_id
- marks
- feedback
- graded_at

### Announcement

Stores announcements posted by teachers.

Fields:
- id
- title
- message
- classroom_id
- author_id
- created_at

## Relationships

- A teacher can create multiple classrooms.
- A classroom belongs to one teacher.
- A classroom can contain multiple assignments.
- An assignment belongs to one classroom.
- A student can submit multiple assignments.
- A submission belongs to one student and one assignment.
- A submission can have one result.
- A classroom can contain multiple announcements.
- An announcement belongs to one classroom and one author.

## Authentication

User authentication is handled using JWT tokens.

Protected API requests require:

```text
Authorization: Bearer <JWT_TOKEN>