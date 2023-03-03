import datetime
import random

from werkzeug.security import generate_password_hash

from misc.extensions import db
from models.employee import Employee
from models.item import Item
from models.transaction import Transaction


def seed_employees(num):
    """
    Seeds the employees table with dummy information.
    """
    for i in range(1, num + 1):
        employee = Employee(
            email=f"test{i}@gmail.com",
            password=generate_password_hash("password"),
            first_name="Test",
            last_name=i,
            is_admin=i == 1
        )
        db.session.add(employee)

    db.session.commit()


def seed_items(num):
    """
    Seeds the items table with dummy information.
    """
    for i in range(1, num + 1):
        item = Item(
            name=f"Item {i}",
            description=f"Item {i} description",
            quantity=random.randint(1, 100),
        )
        db.session.add(item)

    db.session.commit()


def seed_transactions(num):
    """
    Seeds the transactions table with dummy information.
    """

    items = list(db.session.execute(db.select(Item)).scalars())
    employees = list(db.session.execute(db.select(Employee)).scalars())
    for i in range(1, num + 1):
        item = random.choice(items)
        employee = random.choice(employees)
        amt = random.randint(-100, 100)
        while amt == 0 or item.quantity + amt < 0:
            amt = random.randint(-100, 100)
        tx = Transaction(
            quantity=amt,
            transaction_type="in" if amt > 0 else "out",
            external_entity=f"External Entity {random.randint(1, 100)}",
            reporter=employee.email,
            item_id=item.itemId,
        )
        tx.date = tx.date - datetime.timedelta(days=(num - i) // 4)
        db.session.add(tx)
        item.quantity += tx.quantity

    db.session.commit()
