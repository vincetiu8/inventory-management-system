from datetime import datetime, timedelta
from functools import wraps
from http import HTTPStatus

import jwt
from flask import jsonify, request

from extensions import app
from models.employee import Employee


def jsonify_message(message):
    """
    Turns a message into a json response.
    :param message: the message to encode
    :return: a json response with the message
    """
    return jsonify({
        "message": message
    })


def token_required(f):
    """
    A decorator that checks if the request has a valid token.
    :param f: the function to decorate
    :return: the response of the decorated function, or a 401 if the token is invalid
    """

    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # check the request header for a token
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split("Bearer ")[1]

        # return an error if token is not passed
        if not token:
            return jsonify_message('token is missing'), HTTPStatus.UNAUTHORIZED

        try:
            # try decoding the payload to fetch the stored details
            data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=["HS256"])

            # fetch the employee sending the request
            origin_employee = Employee.query.filter_by(email=data['email']).first()

        except:
            # return an error if token is invalid
            return jsonify_message('token is invalid'), HTTPStatus.UNAUTHORIZED

        # adds the origin_employee to the child function arguments
        return f(origin_employee, *args, **kwargs)

    # returns the decorated function
    return decorated


def generate_token(employee):
    """
    Generates a JWT token for the employee
    :param employee: the employee to generate the token for
    :return: the generated token
    """
    token = jwt.encode({
        # we encode the employee email in the token so we can retrieve the employee when decoding the token
        "email": employee.email,

        # we add the expiration duration to the current time
        "exp": datetime.utcnow() + timedelta(minutes=app.config['JWT_EXPIRATION_MINUTES'])
    }, app.config['JWT_SECRET_KEY'], algorithm="HS256")
    return token
