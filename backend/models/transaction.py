from datetime import datetime

from sqlalchemy import ForeignKey, CheckConstraint

from extensions import db


class Transaction(db.Model):
    """
    Information about an update to the warehouse's inventory.
    """

    __table_args__ = (
        CheckConstraint("transactionType IN ('in', 'out', 'other')", name='transaction_type_valid'),
    )

    txId = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    transactionType = db.Column(db.String(100), nullable=False)
    externalEntity = db.Column(db.String(100))
    reporter = db.Column(db.String(100), ForeignKey("employee.email"), nullable=False)
    itemId = db.Column(db.Integer, ForeignKey("item.itemId"), nullable=False)

    def __init__(self, quantity, transaction_type, external_entity, reporter, item_id):
        """
        :param quantity: the quantity of the item (positive if added, negative if removed)
        :param transaction_type: the type of transaction that occurred (in, out, other)
        :param external_entity: the external entity that the items were sent or received from
        :param reporter: the employee who reported the transaction
        :param item_id: the id of the item that was added or removed
        """

        self.date = datetime.now()
        self.quantity = quantity
        self.transactionType = transaction_type
        self.externalEntity = external_entity
        self.reporter = reporter
        self.itemId = item_id

    def serialize(self):
        """
        :return: a dictionary representation of the warehouse entry
        """
        return {
            "txId": self.txId,
            "date": self.date,
            "quantity": self.quantity,
            "transactionType": self.transactionType,
            "externalEntity": self.externalEntity,
            "reporter": self.reporter,
            "itemId": self.itemId
        }
