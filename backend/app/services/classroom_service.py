from ..extensions import db
from ..models.classroom import Classroom


def create_classroom(name, description, code, teacher_id):
    existing = Classroom.query.filter_by(code=code).first()

    if existing:
        return None, "Classroom code already exists."

    classroom = Classroom(
        name=name,
        description=description,
        code=code,
        teacher_id=teacher_id,
    )

    db.session.add(classroom)
    db.session.commit()

    return classroom, None


def get_teacher_classrooms(teacher_id):
    return Classroom.query.filter_by(
        teacher_id=teacher_id
    ).all()


def get_classroom(classroom_id):
    return Classroom.query.get(classroom_id)


def delete_classroom(classroom):
    db.session.delete(classroom)
    db.session.commit()