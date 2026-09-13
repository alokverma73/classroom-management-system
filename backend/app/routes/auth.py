from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token

from ..services.auth_service import register_user, authenticate_user


auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.post("/register")
def register():
    data = request.get_json() or {}

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "student")

    if not name or not email or not password:
        return jsonify({
            "success": False,
            "message": "Name, email and password are required."
        }), 400

    user, error = register_user(name, email, password, role)

    if error:
        status = 409 if "registered" in error else 400
        return jsonify({"success": False, "message": error}), status

    return jsonify({
        "success": True,
        "message": "Registration successful.",
        "user": user.to_dict()
    }), 201


@auth_bp.post("/login")
def login():
    data = request.get_json() or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required."
        }), 400

    user = authenticate_user(email, password)

    if not user:
        return jsonify({
            "success": False,
            "message": "Invalid email or password."
        }), 401

    token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role}
    )

    return jsonify({
        "success": True,
        "message": "Login successful.",
        "token": token,
        "user": user.to_dict()
    }), 200