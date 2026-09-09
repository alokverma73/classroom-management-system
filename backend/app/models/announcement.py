from datetime import datetime

from ..extensions import db


class Announcement(db.Model):
    __tablename__ = "announcements"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(
        db.String(200),
        nullable=False
    )

    message = db.Column(
        db.Text,
        nullable=False
    )

    classroom_id = db.Column(
        db.Integer,
        db.ForeignKey("classrooms.id"),
        nullable=False
    )

    author_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    classroom = db.relationship(
        "Classroom",
        backref=db.backref(
            "announcements",
            cascade="all, delete-orphan"
        )
    )

    author = db.relationship(
        "User",
        backref="announcements"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "message": self.message,
            "classroom_id": self.classroom_id,
            "author_id": self.author_id,
            "author_name": self.author.name if self.author else None,
            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else None
            )
        }