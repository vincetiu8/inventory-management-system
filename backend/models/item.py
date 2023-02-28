from werkzeug.security import generate_password_hash

from extensions import db


class Item(db.Model):
    """
    Information about a certain item the warehouse stocks.
    """

    itemId = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    description = db.Column(db.String(200))

    def __init__(self, name, description):
        """
        :param name: the name of the item
        :param description: a description of the item
        """
        self.name = name
        self.description = description

    def serialize(self):
        """
        :return: a dictionary representation of the employee
        """
        return {
            "itemId": self.itemId,
            "name": self.name,
            "description": self.description
        }
