from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

from ..models.assignment import Assignment
from ..models.classroom import Classroom
from ..models.result import Result
from ..models.submission import Submission


analytics_bp = Blueprint(
    "analytics",
    __name__,
    url_prefix="/api/analytics"
)


@analytics_bp.get("/")
@jwt_required()
def get_analytics():
    user_id = int(get_jwt_identity())

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

    graded_submissions = [
        submission
        for submission in submissions
        if submission.status == "graded"
    ]

    results = (
        Result.query
        .filter(Result.submission_id.in_(
            [submission.id for submission in graded_submissions]
        ))
        .all()
        if graded_submissions
        else []
    )

    average_score = (
        round(
            sum(result.marks_obtained for result in results)
            / len(results),
            2
        )
        if results
        else 0
    )

    return jsonify({
        "success": True,
        "analytics": {
            "total_classrooms": len(classrooms),
            "total_assignments": len(assignments),
            "total_submissions": len(submissions),
            "graded_submissions": len(graded_submissions),
            "average_score": average_score
        }
    }), 200