from werkzeug.security import generate_password_hash

from backend.app import create_app
from backend.app.extensions import db
from backend.app.models.user import User


app = create_app()


with app.app_context():
    if not User.query.filter_by(email="teacher@example.com").first():
        teacher = User(
            name="Demo Teacher",
            email="teacher@example.com",
            password_hash=generate_password_hash("teacher123"),
            role="teacher",
        )
        db.session.add(teacher)

    if not User.query.filter_by(email="student@example.com").first():
        student = User(
            name="Demo Student",
            email="student@example.com",
            password_hash=generate_password_hash("student123"),
            role="student",
        )
        db.session.add(student)

    db.session.commit()

    print("Database seeded successfully.")
    print("Teacher: teacher@example.com / teacher123")
    print("Student: student@example.com / student123")