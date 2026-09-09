from ..extensions import db


class Result(db.Model):
    __tablename__ = "results"

    id = db.Column(db.Integer, primary_key=True)

    marks_obtained = db.Column(
        db.Integer,
        nullable=False
    )

    feedback = db.Column(
        db.Text,
        nullable=True
    )

    submission_id = db.Column(
        db.Integer,
        db.ForeignKey("submissions.id"),
        unique=True,
        nullable=False
    )

    submission = db.relationship(
        "Submission",
        backref=db.backref(
            "result",
            uselist=False,
            cascade="all, delete-orphan"
        )
    )

    def to_dict(self):
        return {
            "id": self.id,
            "marks_obtained": self.marks_obtained,
            "feedback": self.feedback,
            "submission_id": self.submission_id
        }