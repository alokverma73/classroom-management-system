from ..extensions import db
from ..models.result import Result


def grade_submission(
    submission,
    marks_obtained,
    feedback=None,
):
    result = submission.result

    if result:
        result.marks_obtained = marks_obtained
        result.feedback = feedback
    else:
        result = Result(
            marks_obtained=marks_obtained,
            feedback=feedback,
            submission_id=submission.id,
        )

        db.session.add(result)

    submission.status = "graded"

    db.session.commit()

    return result