from http import HTTPStatus

from flask import Blueprint, request, jsonify
from sqlalchemy import or_

from controllers.utils import token_required
from misc.extensions import db
from models.item import Item
from models.transaction import Transaction

items_bp = Blueprint("items", __name__)


@items_bp.route("/create", methods=["POST"])
@token_required
def create_item(origin_user):
    """
    Creates an item.
    :return: the new item
    """

    content = request.get_json()
    item = Item(
        name=content["name"],
        description=content["description"],
        quantity=content["quantity"],
    )
    db.session.add(item)
    db.session.commit()
    tx = Transaction(
        quantity=content["quantity"],
        transaction_type="other",
        external_entity=None,
        reporter=origin_user.email,
        item_id=item.id,
    )
    db.session.add(tx)
    db.session.commit()
    return jsonify(item.serialize()), HTTPStatus.CREATED


@items_bp.route("/all", methods=["GET"])
@token_required
def get_all_items(_):
    """
    Gets all items.
    :return: all items in the system
    """
    items = db.session.execute(db.select(Item)).scalars()
    serialized_items = [item.serialize() for item in items]
    return jsonify(serialized_items), HTTPStatus.OK


@items_bp.route("/search", methods=["POST"])
@token_required
def search_items(_):
    """
    Searches for items.
    :return: all items in the system matching the search criteria
    """
    content = request.get_json()
    order = content["order"]
    order_by = content["orderBy"]
    order_query = Item.__dict__[order_by].asc() if order == "asc" else Item.__dict__[order_by].desc()
    search_key = content["searchKey"]
    attributes = content["attributes"]
    filters = []
    for attribute in attributes:
        filters.append(Item.__dict__[attribute].like(f"%{search_key}%"))
    items = db.session.execute(db.select(Item).where(or_(*filters)).order_by(order_query)).scalars()
    serialized_items = [item.serialize() for item in items]
    return jsonify(serialized_items), HTTPStatus.OK


@items_bp.route("/<itemId>", methods=["GET", "PUT", "DELETE"])
@token_required
def query_item_by_id(_, item_id):
    """
    Queries an item by id. If a GET request is sent, the item is returned. If a PUT request is sent, the item's
    information is updated. If a DELETE request is sent, the item is deleted. Note that the quantity can only be
    modified by making a new transaction.
    :param item_id: the id of the item to query
    :return: the item if a GET or PUT request is sent, nothing if a DELETE request is sent
    """
    item = db.get_or_404(Item, item_id)

    # return the item if a GET request is sent
    if request.method == "GET":
        return jsonify(item.serialize()), HTTPStatus.OK

    # update the item's information if a PUT request is sent
    if request.method == "PUT":
        content = request.get_json()
        item.name = content["name"] if "name" in content else item.name
        item.description = content["description"] if "description" in content else item.description
        db.session.commit()
        return jsonify(item.serialize()), HTTPStatus.ACCEPTED

    # delete the item if a DELETE request is sent
    db.session.delete(item)
    db.session.commit()
    return "", HTTPStatus.NO_CONTENT
