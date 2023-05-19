import smtplib
import psycopg2
from config import *
import bcrypt

connection = psycopg2.connect(
    host=DB_HOST,
    dbname=DB_NAME,
    user=DB_USER,
    password=DB_PASS
)


def gen_token():
    pass


def send_message(email: str):
    pass


def hash_password(pwd: str) -> bytes:
    hash_and_salt = bcrypt.hashpw(pwd.encode(), bcrypt.gensalt())
    return hash_and_salt


def check_password(hash_str: bytes, password: str) -> bool:
    return bcrypt.checkpw(password.encode(), bytes(hash_str))


def check_access(token: str):
    pass
