from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

from ..extensions import db
from ..models.announcement import Announcement
from ..models.classroom import Classroom


announcements_bp = Blueprint(
    "announcements",
    __name__,
    url_prefix="/api/announcements"
)


@announcements_bp.get("/")
@jwt_required()
def get_announcements():
    user_id = int(get_jwt_identity())

    announcements = (
        Announcement.query
        .join(Classroom)
        .filter(Classroom.teacher_id == user_id)
        .order_by(Announcement.created_at.desc())
        .all()
    )

    return jsonify({
        "success": True,
        "announcements": [
            announcement.to_dict()
            for announcement in announcements
        ]
    }), 200


@announcements_bp.post("/")
@jwt_required()
def create_announcement():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    title = data.get("title")
    message = data.get("message")
    classroom_id = data.get("classroom_id")

    if not title or not message or not classroom_id:
        return jsonify({
            "success": False,
            "message": "Title, message and classroom_id are required."
        }), 400

    classroom = Classroom.query.get(classroom_id)

    if not classroom:
        return jsonify({
            "success": False,
            "message": "Classroom not found."
        }), 404

    if classroom.teacher_id != user_id:
        return jsonify({
            "success": False,
            "message": "You can only post announcements in your classrooms."
        }), 403

    announcement = Announcement(
        title=title,
        message=message,
        classroom_id=classroom_id,
        author_id=user_id
    )

    db.session.add(announcement)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Announcement created successfully.",
        "announcement": announcement.to_dict()
    }), 201


@announcements_bp.delete("/<int:announcement_id>")
@jwt_required()
def delete_announcement(announcement_id):
    user_id = int(get_jwt_identity())

    announcement = Announcement.query.get(announcement_id)

    if not announcement:
        return jsonify({
            "success": False,
            "message": "Announcement not found."
        }), 404

    if announcement.author_id != user_id:
        return jsonify({
            "success": False,
            "message": "You can only delete your own announcements."
        }), 403

    db.session.delete(announcement)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Announcement deleted successfully."
    }), 200
@announcements_bp.get("/classroom/<int:classroom_id>")
@jwt_required()
def get_classroom_announcements(classroom_id):
    user_id = int(get_jwt_identity())

    classroom = Classroom.query.get(classroom_id)

    if not classroom:
        return jsonify({
            "success": False,
            "message": "Classroom not found."
        }), 404

    announcements = (
        Announcement.query
        .filter_by(classroom_id=classroom_id)
        .order_by(Announcement.created_at.desc())
        .all()
    )

    return jsonify({
        "success": True,
        "announcements": [
            announcement.to_dict()
            for announcement in announcements
        ]
    }), 200