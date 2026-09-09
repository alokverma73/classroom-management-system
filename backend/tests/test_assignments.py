from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.classroom import Classroom
from app.models.assignment import Assignment


def test_create_assignment():
    app = create_app()
    app.config.update(
        TESTING=True,
        SQLALCHEMY_DATABASE_URI="sqlite:///:memory:",
    )

    with app.app_context():
        db.drop_all()
        db.create_all()

        teacher = User(
            name="Teacher",
            email="teacher@test.com",
            role="teacher",
        )
        teacher.set_password("password")

        db.session.add(teacher)
        db.session.commit()

        classroom = Classroom(
            name="Test Class",
            description="Test classroom",
            code="CLASS01",
            teacher_id=teacher.id,
        )

        db.session.add(classroom)
        db.session.commit()

        assignment = Assignment(
            title="Test Assignment",
            description="Complete this task",
            total_marks=100,
            classroom_id=classroom.id,
        )

        db.session.add(assignment)
        db.session.commit()

        assert assignment.id is not None
        assert assignment.title == "Test Assignment"
        assert assignment.total_marks == 100
        assert assignment.classroom_id == classroom.id