from flask import Blueprint
from werkzeug.security import generate_password_hash

from controllers.item import items_bp
from controllers.transaction import txs_bp
from extensions import app, db
from controllers.employee import employees_bp
from models.employee import Employee
from models.item import Item

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
    item = Item(
        name="Item 1",
        description="Item 1 description",
        quantity=10,
    )
    db.session.add(item)
    item = Item(
        name="Item 2",
        description="Item 2 description",
        quantity=20,
    )
    db.session.add(item)
    db.session.commit()

    # register controller routes
    bp = Blueprint("main", __name__)
    bp.register_blueprint(employees_bp, url_prefix="/employees")
    bp.register_blueprint(items_bp, url_prefix="/items")
    bp.register_blueprint(txs_bp, url_prefix="/txs")
    app.register_blueprint(bp, url_prefix="/api")

    # run the app
    app.run(debug=True)
