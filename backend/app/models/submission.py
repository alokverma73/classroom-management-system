from datetime import datetime

from ..extensions import db


class Submission(db.Model):
    __tablename__ = "submissions"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    status = db.Column(
        db.String(20),
        nullable=False,
        default="pending"
    )
    submitted_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    student_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    assignment_id = db.Column(
        db.Integer,
        db.ForeignKey("assignments.id"),
        nullable=False
    )

    student = db.relationship(
        "User",
        backref="submissions"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "content": self.content,
            "status": self.status,
            "marks": (
                self.result.marks_obtained
                if self.result
                else None
            ),
            "feedback": (
                self.result.feedback
                if self.result
                else None
            ),
            "submitted_at": (
                self.submitted_at.isoformat()
                if self.submitted_at
                else None
            ),
            "student_id": self.student_id,
            "assignment_id": self.assignment_id
        }