from werkzeug.security import generate_password_hash

from extensions import db


class Employee(db.Model):
    """
    An employee working at the warehouse.
    """

    email = db.Column(db.String(100), primary_key=True)
    password = db.Column(db.String(100), nullable=False)
    firstName = db.Column(db.String(100), nullable=False)
    lastName = db.Column(db.String(100), nullable=False)
    isAdmin = db.Column(db.Boolean, default=False)

    def __init__(self, email, password, first_name, last_name, is_admin):
        """
        :param email: the email of the employee
        :param password: the hashed password of the employee
        :param first_name: the first name of the employee
        :param last_name: the last name of the employee
        :param is_admin: whether the employee has admin access
        """
        self.email = email
        self.password = password
        self.firstName = first_name
        self.lastName = last_name
        self.isAdmin = is_admin

    def serialize(self):
        """
        :return: a dictionary representation of the employee
        """
        return {
            "email": self.email,
            "firstName": self.firstName,
            "lastName": self.lastName,
            "isAdmin": self.isAdmin
        }
