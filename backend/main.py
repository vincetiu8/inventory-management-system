from flask import Blueprint
from werkzeug.security import generate_password_hash

from extensions import app, db
from controllers.employee import employee_bp
from models.employee import Employee

if __name__ == "__main__":
    # reset database tables
    db.drop_all()
    db.create_all()

    # seed tables with dummy information
    employee = Employee(
        email="vincetiu8@gmail.com",
        password=generate_password_hash("password"),
        first_name="Vince",
        last_name="Tiu",
        is_admin=True
    )
    db.session.add(employee)
    employee = Employee(
        email="vincetwo8@gmail.com",
        password=generate_password_hash("password"),
        first_name="Vince",
        last_name="Two",
        is_admin=False
    )
    db.session.add(employee)
    db.session.commit()

    # register controller routes
    bp = Blueprint("main", __name__)
    bp.register_blueprint(employee_bp, url_prefix="/employees")
    app.register_blueprint(bp, url_prefix="/api")

    # run the app
    app.run(debug=True)
