import os

DB_HOST = 'localhost'
DB_NAME = 'guides_data'
DB_USER = 'postgres'
DB_PASS = 'default'

ID = 0
DESCRIPTION = 1
DATE = 2
AUTHOR = 3
TITLE = 4
VIEWS = 5

SALT = os.urandom(32)

SECRET_KEY_FOR_TOKEN = "test"
