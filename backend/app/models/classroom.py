from ..extensions import db


class Classroom(db.Model):
    __tablename__ = "classrooms"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    code = db.Column(db.String(50), unique=True, nullable=False)
    teacher_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    teacher = db.relationship(
        "User",
        backref="classrooms"
    )

    assignments = db.relationship(
        "Assignment",
        backref="classroom",
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "code": self.code,
            "teacher_id": self.teacher_id
        }