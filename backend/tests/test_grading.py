import pytest

from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.classroom import Classroom
from app.models.assignment import Assignment
from app.models.submission import Submission
from app.services.grading_service import grade_submission


@pytest.fixture
def app():
    app = create_app()
    app.config.update(
        TESTING=True,
        SQLALCHEMY_DATABASE_URI="sqlite:///:memory:",
    )

    with app.app_context():
        db.drop_all()
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


def test_grade_submission(app):
    with app.app_context():
        teacher = User(
            name="Teacher",
            email="teacher@test.com",
            role="teacher",
        )
        teacher.set_password("password")

        student = User(
            name="Student",
            email="student@test.com",
            role="student",
        )
        student.set_password("password")

        db.session.add_all([teacher, student])
        db.session.commit()

        classroom = Classroom(
            name="Test Classroom",
            description="Test",
            code="TEST01",
            teacher_id=teacher.id,
        )

        db.session.add(classroom)
        db.session.commit()

        assignment = Assignment(
            title="Test Assignment",
            description="Test",
            total_marks=100,
            classroom_id=classroom.id,
        )

        db.session.add(assignment)
        db.session.commit()

        submission = Submission(
            content="My answer",
            student_id=student.id,
            assignment_id=assignment.id,
        )

        db.session.add(submission)
        db.session.commit()

        result = grade_submission(
            submission,
            85,
            "Good work",
        )

        assert result.marks_obtained == 85
        assert result.feedback == "Good work"
        assert submission.status == "graded"
        assert submission.result is not None