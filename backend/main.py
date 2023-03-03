from flask import Blueprint

from controllers.employee import employees_bp
from controllers.item import items_bp
from controllers.transaction import txs_bp
from misc.extensions import app, db
from misc.seed import seed_employees, seed_items, seed_transactions

if __name__ == "__main__":
    if app.config["MODE"] == "test":
        # reset database tables
        db.drop_all()
        db.create_all()

        seed_employees(10)
        seed_items(10)
        seed_transactions(1600)

    # register controller routes
    bp = Blueprint("main", __name__)
    bp.register_blueprint(employees_bp, url_prefix="/employees")
    bp.register_blueprint(items_bp, url_prefix="/items")
    bp.register_blueprint(txs_bp, url_prefix="/txs")
    app.register_blueprint(bp, url_prefix="/api")

    # run the app
    app.run(debug=True)
