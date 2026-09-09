from datetime import datetime

from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required, get_jwt

from ..extensions import db
from ..models.assignment import Assignment
from ..models.classroom import Classroom


assignments_bp = Blueprint(
    "assignments",
    __name__,
    url_prefix="/api/assignments"
)


@assignments_bp.get("/")
@jwt_required()
def get_assignments():
    user_id = int(get_jwt_identity())
    claims = get_jwt()

    if claims.get("role") == "teacher":
        assignments = (
            Assignment.query
            .join(Classroom)
            .filter(Classroom.teacher_id == user_id)
            .all()
        )
    else:
        assignments = Assignment.query.all()

    return jsonify({
        "success": True,
        "assignments": [
            assignment.to_dict()
            for assignment in assignments
        ]
    }), 200


@assignments_bp.post("/")
@jwt_required()
def create_assignment():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    title = data.get("title")
    description = data.get("description")
    total_marks = data.get("total_marks", 100)
    due_date = data.get("due_date")
    classroom_id = data.get("classroom_id")

    if not title or not classroom_id:
        return jsonify({
            "success": False,
            "message": "Title and classroom_id are required."
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
            "message": "You can only create assignments for your classrooms."
        }), 403

    parsed_due_date = None

    if due_date:
        try:
            parsed_due_date = datetime.fromisoformat(due_date)
        except ValueError:
            return jsonify({
                "success": False,
                "message": "Invalid due_date format."
            }), 400

    assignment = Assignment(
        title=title,
        description=description,
        total_marks=total_marks,
        due_date=parsed_due_date,
        classroom_id=classroom_id
    )

    db.session.add(assignment)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Assignment created successfully.",
        "assignment": assignment.to_dict()
    }), 201


@assignments_bp.get("/<int:assignment_id>")
@jwt_required()
def get_assignment(assignment_id):
    assignment = Assignment.query.get(assignment_id)

    if not assignment:
        return jsonify({
            "success": False,
            "message": "Assignment not found."
        }), 404

    return jsonify({
        "success": True,
        "assignment": assignment.to_dict()
    }), 200


@assignments_bp.put("/<int:assignment_id>")
@jwt_required()
def update_assignment(assignment_id):
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    assignment = Assignment.query.get(assignment_id)

    if not assignment:
        return jsonify({
            "success": False,
            "message": "Assignment not found."
        }), 404

    if assignment.classroom.teacher_id != user_id:
        return jsonify({
            "success": False,
            "message": "You can only edit your own assignments."
        }), 403

    title = data.get("title")
    description = data.get("description")
    total_marks = data.get("total_marks")
    due_date = data.get("due_date")

    if not title:
        return jsonify({
            "success": False,
            "message": "Title is required."
        }), 400

    parsed_due_date = None

    if due_date:
        try:
            parsed_due_date = datetime.fromisoformat(due_date)
        except ValueError:
            return jsonify({
                "success": False,
                "message": "Invalid due_date format."
            }), 400

    assignment.title = title
    assignment.description = description
    assignment.total_marks = int(total_marks)
    assignment.due_date = parsed_due_date

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Assignment updated successfully.",
        "assignment": assignment.to_dict()
    }), 200


@assignments_bp.delete("/<int:assignment_id>")
@jwt_required()
def delete_assignment(assignment_id):
    user_id = int(get_jwt_identity())

    assignment = Assignment.query.get(assignment_id)

    if not assignment:
        return jsonify({
            "success": False,
            "message": "Assignment not found."
        }), 404

    if assignment.classroom.teacher_id != user_id:
        return jsonify({
            "success": False,
            "message": "You can only delete your own assignments."
        }), 403

    db.session.delete(assignment)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Assignment deleted successfully."
    }), 200