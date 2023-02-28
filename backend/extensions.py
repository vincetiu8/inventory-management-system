import os

from dotenv import load_dotenv
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

load_dotenv()

app = Flask(os.environ.get("APP_NAME"))
app.app_context().push()
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URI")
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")
app.config["JWT_EXPIRATION_MINUTES"] = int(os.environ.get("JWT_EXPIRATION_MINUTES"))

db = SQLAlchemy(app)
