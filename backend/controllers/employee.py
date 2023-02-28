import datetime
from http import HTTPStatus

import jwt
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta, datetime
from controllers.utils import jsonify_message, token_required, generate_token
from extensions import db
from models.employee import Employee

employees_bp = Blueprint("employees", __name__)


@employees_bp.route("/create", methods=["POST"])
@token_required
def create_employee(origin_employee):
    """
    Creates an employee.
    :param origin_employee: The employee that is creating the new employee
    :return: the new employee
    """
    if not origin_employee.isAdmin:
        return jsonify_message("unauthorized"), HTTPStatus.UNAUTHORIZED

    content = request.get_json()
    employee = Employee(
        email=content["email"],
        password=generate_password_hash(content["password"]),
        first_name=content["firstName"],
        last_name=content["lastName"],
        is_admin=content["isAdmin"]
    )
    db.session.add(employee)
    db.session.commit()
    return jsonify(employee.serialize()), HTTPStatus.CREATED


@employees_bp.route("/all", methods=["GET"])
@token_required
def get_all_employees(_):
    """
    Gets all employees.
    :return: all employees in the system
    """
    employees = db.session.execute(db.select(Employee)).scalars()
    serialized_employees = [employee.serialize() for employee in employees]
    return jsonify(serialized_employees), HTTPStatus.OK


@employees_bp.route("/<email>", methods=["GET", "PUT", "DELETE"])
@token_required
def query_employee_by_email(origin_employee, email):
    """
    Queries an employee by email. If a GET request is sent, the employee is returned. If a PUT request is sent,
    the employee's information is updated. If a DELETE request is sent, the employee is deleted. :param
    origin_employee: the employee that is querying the employee.
    :param email: the email of the employee to query
    :return: the employee if a GET or PUT request is sent, nothing if a DELETE request is sent
    """
    employee = db.get_or_404(Employee, email)

    # return the employee if a GET request is sent
    if request.method == "GET":
        return jsonify(employee.serialize()), HTTPStatus.OK

    # return an error if the origin employee is not an admin
    if not origin_employee.isAdmin:
        return jsonify_message("unauthorized"), HTTPStatus.UNAUTHORIZED

    # update the employee's information if a PUT request is sent
    if request.method == "PUT":
        content = request.get_json()
        employee.email = content["email"] if "email" in content else employee.email
        employee.password = generate_password_hash(content["password"]) if "password" in content else employee.password
        employee.firstName = content["firstName"] if "firstName" in content else employee.firstName
        employee.lastName = content["lastName"] if "lastName" in content else employee.lastName
        employee.isAdmin = content["isAdmin"] if "isAdmin" in content else employee.isAdmin
        db.session.commit()
        return jsonify(employee.serialize()), HTTPStatus.ACCEPTED

    # delete the employee if a DELETE request is sent
    db.session.delete(employee)
    db.session.commit()
    return "", HTTPStatus.NO_CONTENT


@employees_bp.route("/login", methods=["POST"])
def login():
    """
    Logs in an employee.
    :return: a jwt token allowing the employee to access protected routes
    """
    content = request.get_json()
    if "email" not in content or "password" not in content:
        # return an error if no email or password is provided
        return jsonify_message("missing credentials"), HTTPStatus.BAD_REQUEST

    employee = Employee.query.filter_by(email=content["email"]).first()

    if not employee:
        # return an error if the employee does not exist
        return jsonify_message("employee does not exist"), HTTPStatus.BAD_REQUEST

    if not check_password_hash(employee.password, content["password"]):
        # return an error if the password is incorrect
        return jsonify_message("invalid credentials"), HTTPStatus.UNAUTHORIZED

    # generate and return a jwt token
    token = generate_token(employee)
    return jsonify({
        "token": token
    }), HTTPStatus.OK
