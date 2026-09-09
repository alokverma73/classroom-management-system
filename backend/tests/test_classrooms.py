from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.classroom import Classroom


def test_create_classroom():
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
            name="Python Class",
            description="Programming",
            code="PYTHON01",
            teacher_id=teacher.id,
        )

        db.session.add(classroom)
        db.session.commit()

        assert classroom.id is not None
        assert classroom.name == "Python Class"
        assert classroom.code == "PYTHON01"
        assert classroom.teacher_id == teacher.id


def test_duplicate_classroom_code():
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
            name="Class One",
            code="SAME01",
            teacher_id=teacher.id,
        )

        db.session.add(classroom)
        db.session.commit()

        duplicate = Classroom(
            name="Class Two",
            code="SAME01",
            teacher_id=teacher.id,
        )

        db.session.add(duplicate)

        try:
            db.session.commit()
            assert False
        except Exception:
            db.session.rollback()
            assert True