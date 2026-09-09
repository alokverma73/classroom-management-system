from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

from ..models.assignment import Assignment
from ..models.classroom import Classroom
from ..models.submission import Submission
from ..models.user import User


dashboard_bp = Blueprint(
    "dashboard",
    __name__,
    url_prefix="/api/dashboard"
)


@dashboard_bp.get("/")
@jwt_required()
def get_dashboard():
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

        classroom_ids = [classroom.id for classroom in classrooms]

        assignments = (
            Assignment.query
            .filter(Assignment.classroom_id.in_(classroom_ids))
            .all()
            if classroom_ids
            else []
        )

        assignment_ids = [assignment.id for assignment in assignments]

        submissions = (
            Submission.query
            .filter(Submission.assignment_id.in_(assignment_ids))
            .all()
            if assignment_ids
            else []
        )

        graded = [
            submission for submission in submissions
            if submission.status == "graded"
        ]

        return jsonify({
            "success": True,
            "role": "teacher",
            "stats": {
                "classrooms": len(classrooms),
                "assignments": len(assignments),
                "submissions": len(submissions),
                "graded_submissions": len(graded),
                "pending_submissions": (
                    len(submissions) - len(graded)
                )
            }
        }), 200

    submissions = Submission.query.filter_by(
        student_id=user_id
    ).all()

    graded = [
        submission for submission in submissions
        if submission.status == "graded"
    ]

    return jsonify({
        "success": True,
        "role": "student",
        "stats": {
            "submissions": len(submissions),
            "completed": len(graded),
            "pending": len(submissions) - len(graded)
        }
    }), 200