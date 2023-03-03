from http import HTTPStatus

from flask import Blueprint, request, jsonify
from sqlalchemy import or_

from controllers.utils import token_required
from misc.extensions import db
from models.employee import Employee
from models.item import Item
from models.transaction import Transaction

txs_bp = Blueprint("txs", __name__)


@txs_bp.route("/create", methods=["POST"])
@token_required
def create_transaction(origin_user):
    """
    Creates a transaction.
    :return: the new transaction
    """

    content = request.get_json()
    # check if the item exists and get it
    item = db.get_or_404(Item, content["itemId"])
    tx = Transaction(
        quantity=content["quantity"],
        transaction_type=content["transactionType"],
        external_entity=content["externalEntity"],
        reporter=origin_user.email,
        item_id=content["itemId"],
    )
    db.session.add(tx)
    item.quantity += tx.quantity
    db.session.commit()
    return jsonify(tx.serialize()), HTTPStatus.CREATED


@txs_bp.route("/all", methods=["GET"])
@token_required
def get_all_transactions(_):
    """
    Gets all transactions.
    :return: all transactions in the system
    """
    txs = db.session.execute(db.select(Transaction)).scalars()
    serialized_txs = [tx.serialize() for tx in txs]
    return jsonify(serialized_txs), HTTPStatus.OK


@txs_bp.route("/search", methods=["POST"])
@token_required
def search_transactions(_):
    """
    Searches for transactions.
    :return: all transactions in the system matching the search criteria
    """
    content = request.get_json()
    order = content["order"]
    order_by = content["orderBy"]
    order_query = Transaction.__dict__[order_by].asc() if order == "asc" else Transaction.__dict__[order_by].desc()
    search_key = content["searchKey"]
    attributes = content["attributes"]
    filters = []
    for attribute in attributes:
        filters.append(Transaction.__dict__[attribute].like(f"%{search_key}%"))
    txs = db.session.execute(db.select(Transaction).where(or_(*filters)).order_by(order_query)).scalars()
    serialized_txs = [tx.serialize() for tx in txs]
    return jsonify(serialized_txs), HTTPStatus.OK


@txs_bp.route("/item/<itemId>", methods=["GET"])
@token_required
def get_transactions_by_item_id(_, item_id):
    """
    Gets all transactions for a given item.
    :param item_id: the id of the item to query
    """
    # check if the item exists
    _ = db.get_or_404(Item, item_id)

    txs = db.session.execute(db.select(Transaction).where(Transaction.item_id == item_id)).scalars()
    serialized_txs = [tx.serialize() for tx in txs]
    return jsonify(serialized_txs), HTTPStatus.OK


@txs_bp.route("/employee/<email>", methods=["GET"])
@token_required
def get_transactions_by_user_email(_, email):
    """
    Gets all transactions made by a given employee.
    :param email: the email of the employee to query
    """
    # check if the employee exists
    _ = db.get_or_404(Employee, email)

    txs = db.session.execute(db.select(Transaction).where(Transaction.reporter == email)).scalars()
    serialized_txs = [tx.serialize() for tx in txs]
    return jsonify(serialized_txs), HTTPStatus.OK
