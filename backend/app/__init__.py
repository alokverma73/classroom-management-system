from flask import Flask
from flask_cors import CORS

from .config import Config
from .extensions import db, jwt


def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

    from .routes.auth import auth_bp
    from .routes.assignments import assignments_bp
    from .routes.classrooms import classrooms_bp
    from .routes.dashboard import dashboard_bp
    from .routes.submissions import submissions_bp
    from .routes.analytics import analytics_bp
    from .routes.announcements import announcements_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(assignments_bp)
    app.register_blueprint(classrooms_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(submissions_bp)
    app.register_blueprint(analytics_bp)
    app.register_blueprint(announcements_bp)

    with app.app_context():
        db.create_all()

    return app