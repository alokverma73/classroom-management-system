from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, get_jwt

from ..extensions import db
from ..models.assignment import Assignment
from ..models.submission import Submission


submissions_bp = Blueprint(
    "submissions",
    __name__,
    url_prefix="/api/submissions"
)


@submissions_bp.post("/")
def submit_assignment():
    from flask_jwt_extended import jwt_required

    @jwt_required()
    def _submit():
        student_id = int(get_jwt_identity())
        claims = get_jwt()

        if claims.get("role") != "student":
            return jsonify({
                "success": False,
                "message": "Only students can submit assignments."
            }), 403

        data = request.get_json() or {}

        assignment_id = data.get("assignment_id")
        content = data.get("content", "").strip()

        if not assignment_id or not content:
            return jsonify({
                "success": False,
                "message": "Assignment ID and submission content are required."
            }), 400

        assignment = Assignment.query.get(assignment_id)

        if not assignment:
            return jsonify({
                "success": False,
                "message": "Assignment not found."
            }), 404

        existing = Submission.query.filter_by(
            student_id=student_id,
            assignment_id=assignment_id
        ).first()

        if existing:
            return jsonify({
                "success": False,
                "message": "You have already submitted this assignment."
            }), 409

        submission = Submission(
            content=content,
            student_id=student_id,
            assignment_id=assignment_id
        )

        db.session.add(submission)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Assignment submitted successfully.",
            "submission": submission.to_dict()
        }), 201

    return _submit()


@submissions_bp.get("/my")
def get_my_submissions():
    from flask_jwt_extended import jwt_required

    @jwt_required()
    def _get():
        student_id = int(get_jwt_identity())

        submissions = Submission.query.filter_by(
            student_id=student_id
        ).all()

        return jsonify({
            "success": True,
            "submissions": [
                submission.to_dict()
                for submission in submissions
            ]
        }), 200

    return _get()


@submissions_bp.get("/")
def get_all_submissions():
    from flask_jwt_extended import jwt_required

    @jwt_required()
    def _get():
        user_id = int(get_jwt_identity())
        claims = get_jwt()

        if claims.get("role") != "teacher":
            return jsonify({
                "success": False,
                "message": "Only teachers can view all submissions."
            }), 403

        submissions = (
            Submission.query
            .join(Assignment)
            .filter(
                Assignment.classroom.has(
                    teacher_id=user_id
                )
            )
            .all()
        )

        return jsonify({
            "success": True,
            "submissions": [
                submission.to_dict()
                for submission in submissions
            ]
        }), 200

    return _get()


@submissions_bp.get("/<int:submission_id>")
def get_submission(submission_id):
    from flask_jwt_extended import jwt_required

    @jwt_required()
    def _get():
        user_id = int(get_jwt_identity())
        claims = get_jwt()

        submission = Submission.query.get(submission_id)

        if not submission:
            return jsonify({
                "success": False,
                "message": "Submission not found."
            }), 404

        is_teacher = claims.get("role") == "teacher"
        is_owner = submission.student_id == user_id

        if is_teacher:
            if submission.assignment.classroom.teacher_id != user_id:
                return jsonify({
                    "success": False,
                    "message": "You are not authorized to view this submission."
                }), 403
        elif not is_owner:
            return jsonify({
                "success": False,
                "message": "You are not authorized to view this submission."
            }), 403

        return jsonify({
            "success": True,
            "submission": submission.to_dict()
        }), 200

    return _get()