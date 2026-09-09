from app import create_app
from app.extensions import db
from app.models.user import User


def test_register_user():
    app = create_app()
    app.config.update(
        TESTING=True,
        SQLALCHEMY_DATABASE_URI="sqlite:///:memory:",
    )

    with app.app_context():
        db.drop_all()
        db.create_all()

        user = User(
            name="Test User",
            email="test@example.com",
            role="student",
        )
        user.set_password("password123")

        db.session.add(user)
        db.session.commit()

        assert user.id is not None
        assert user.email == "test@example.com"
        assert user.check_password("password123")