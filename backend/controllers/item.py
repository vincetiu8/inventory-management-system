from http import HTTPStatus

from flask import Blueprint, request, jsonify

from controllers.utils import token_required
from extensions import db
from models.item import Item

items_bp = Blueprint("items", __name__)


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


@items_bp.route("/create", methods=["POST"])
@token_required
def create_item(_):
    """
    Creates an item.
    :return: the new item
    """

    content = request.get_json()
    item = Item(
        name=content["name"],
        description=content["description"],
    )
    db.session.add(item)
    db.session.commit()
    return jsonify(item.serialize()), HTTPStatus.CREATED


@items_bp.route("/<itemId>", methods=["GET", "PUT", "DELETE"])
@token_required
def query_item_by_id(_, item_id):
    """
    Queries an item by id. If a GET request is sent, the item is returned. If a PUT request is sent,
    the item's information is updated. If a DELETE request is sent, the item is deleted.
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
