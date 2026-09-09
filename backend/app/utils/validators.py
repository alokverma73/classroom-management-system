import re


def validate_email(email):
    if not email:
        return False

    pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
    return bool(re.match(pattern, email))


def validate_password(password):
    return bool(password and len(password) >= 6)


def validate_role(role):
    return role in ("student", "teacher")