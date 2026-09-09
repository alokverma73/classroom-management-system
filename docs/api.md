# API Documentation

Base URL:

```text
http://127.0.0.1:5000/api
## Authentication

### POST /auth/register

Register a new user.

### POST /auth/login

Login and receive an authentication token.

### GET /auth/me

Get the currently authenticated user's details.

## Assignments

### GET /assignments/

Get assignments available to the authenticated user.

### GET /assignments/<assignment_id>

Get details of an assignment.

### POST /assignments/

Create an assignment. Teacher only.

### DELETE /assignments/<assignment_id>

Delete an assignment. Teacher only.

## Submissions

### GET /submissions/

Get submissions available to the authenticated user.

### POST /submissions/

Submit an assignment. Student only.

### PUT /submissions/<submission_id>

Update a submission. Student only.

### DELETE /submissions/<submission_id>

Delete a submission. Student only.

## Announcements

### GET /announcements/

Get announcements created by the authenticated teacher.

### POST /announcements/

Create an announcement. Teacher only.

### GET /announcements/classroom/<classroom_id>

Get announcements for a classroom.

### DELETE /announcements/<announcement_id>

Delete an announcement. Teacher only.

## Results

### GET /results/

Get results available to the authenticated user.

### POST /results/

Create or publish a result. Teacher only.

### PUT /results/<result_id>

Update a result. Teacher only.

## Users

### GET /users/

Get users available to the authenticated user.

### GET /users/<user_id>

Get details of a user.

### PUT /users/<user_id>

Update user details.

## Health Check

### GET /health

Check whether the backend API is running.