from sqlalchemy import CheckConstraint

from extensions import db


class Item(db.Model):
    """
    Information about a certain item the warehouse stocks.
    """

    __table_args__ = (
        CheckConstraint("quantity > 0", name='quantity_positive'),
    )

    itemId = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    def __init__(self, name, description, quantity):
        """
        :param name: the name of the item
        :param description: a description of the item
        :param quantity: the quantity of the item in the warehouse
        """
        self.name = name
        self.description = description
        self.quantity = quantity

    def serialize(self):
        """
        :return: a dictionary representation of the item
        """
        return {
            "itemId": self.itemId,
            "name": self.name,
            "description": self.description,
            "quantity": self.quantity
        }
