from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

from ..extensions import db
from ..models.classroom import Classroom
from ..models.user import User


classrooms_bp = Blueprint(
    "classrooms",
    __name__,
    url_prefix="/api/classrooms"
)


@classrooms_bp.get("/")
@jwt_required()
def get_classrooms():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    if user.role == "teacher":
        classrooms = Classroom.query.filter_by(
            teacher_id=user_id
        ).all()
    else:
        classrooms = Classroom.query.all()

    return jsonify({
        "success": True,
        "classrooms": [
            classroom.to_dict()
            for classroom in classrooms
        ]
    }), 200


@classrooms_bp.post("/")
@jwt_required()
def create_classroom():
    user_id = int(get_jwt_identity())

    user = User.query.get(user_id)

    if not user or user.role != "teacher":
        return jsonify({
            "success": False,
            "message": "Only teachers can create classrooms."
        }), 403

    data = request.get_json() or {}

    name = data.get("name", "").strip()
    description = data.get("description", "").strip()
    code = data.get("code", "").strip().upper()

    if not name or not code:
        return jsonify({
            "success": False,
            "message": "Name and classroom code are required."
        }), 400

    if Classroom.query.filter_by(code=code).first():
        return jsonify({
            "success": False,
            "message": "Classroom code already exists."
        }), 409

    classroom = Classroom(
        name=name,
        description=description,
        code=code,
        teacher_id=user_id
    )

    db.session.add(classroom)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Classroom created successfully.",
        "classroom": classroom.to_dict()
    }), 201


@classrooms_bp.get("/<int:classroom_id>")
@jwt_required()
def get_classroom(classroom_id):
    classroom = Classroom.query.get(classroom_id)

    if not classroom:
        return jsonify({
            "success": False,
            "message": "Classroom not found."
        }), 404

    return jsonify({
        "success": True,
        "classroom": classroom.to_dict()
    }), 200


@classrooms_bp.delete("/<int:classroom_id>")
@jwt_required()
def delete_classroom(classroom_id):
    user_id = int(get_jwt_identity())

    classroom = Classroom.query.get(classroom_id)

    if not classroom:
        return jsonify({
            "success": False,
            "message": "Classroom not found."
        }), 404

    if classroom.teacher_id != user_id:
        return jsonify({
            "success": False,
            "message": "You can only delete your own classrooms."
        }), 403

    db.session.delete(classroom)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Classroom deleted successfully."
    }), 200