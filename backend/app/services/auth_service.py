from ..models.user import User


def register_user(name, email, password, role="student"):
    if User.query.filter_by(email=email).first():
        return None, "Email already registered."

    if role not in ("student", "teacher"):
        return None, "Invalid role."

    user = User(
        name=name,
        email=email,
        role=role,
    )

    user.set_password(password)

    return user, None


def authenticate_user(email, password):
    user = User.query.filter_by(email=email).first()

    if not user:
        return None

    if not user.check_password(password):
        return None

    return user