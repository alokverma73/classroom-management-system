from ..extensions import db


class Assignment(db.Model):
    __tablename__ = "assignments"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    total_marks = db.Column(db.Integer, nullable=False, default=100)
    due_date = db.Column(db.DateTime, nullable=True)

    classroom_id = db.Column(
        db.Integer,
        db.ForeignKey("classrooms.id"),
        nullable=False
    )

    submissions = db.relationship(
        "Submission",
        backref="assignment",
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "total_marks": self.total_marks,
            "due_date": (
                self.due_date.isoformat()
                if self.due_date
                else None
            ),
            "classroom_id": self.classroom_id
        }