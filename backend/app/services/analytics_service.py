from ..models.assignment import Assignment
from ..models.classroom import Classroom
from ..models.submission import Submission


def get_teacher_analytics(teacher_id):
    classrooms = Classroom.query.filter_by(
        teacher_id=teacher_id
    ).all()

    classroom_ids = [
        classroom.id for classroom in classrooms
    ]

    assignments = (
        Assignment.query
        .filter(
            Assignment.classroom_id.in_(classroom_ids)
        )
        .all()
        if classroom_ids
        else []
    )

    assignment_ids = [
        assignment.id for assignment in assignments
    ]

    submissions = (
        Submission.query
        .filter(
            Submission.assignment_id.in_(assignment_ids)
        )
        .all()
        if assignment_ids
        else []
    )

    graded_submissions = [
        submission
        for submission in submissions
        if submission.result is not None
    ]

    average_score = 0

    if graded_submissions:
        average_score = sum(
            submission.result.marks_obtained
            for submission in graded_submissions
        ) / len(graded_submissions)

    return {
        "total_classrooms": len(classrooms),
        "total_assignments": len(assignments),
        "total_submissions": len(submissions),
        "graded_submissions": len(graded_submissions),
        "average_score": round(average_score, 2),
    }