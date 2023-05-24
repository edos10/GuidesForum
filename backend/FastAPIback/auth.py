import random
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from check_auth import new_user
from change_password import hash_password, check_password
from string import ascii_letters, punctuation, digits
import psycopg2
from config import *

router_auth = APIRouter()

def connection_start():
    connection = psycopg2.connect(
        host=DB_HOST,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASS
    )
    return connection

bad_auth = 401
generate_token = list(ascii_letters + punctuation + digits)
generate_token.remove("'")
generate_token.remove('"')
len_token = 40


@router_auth.post('/api/auth/register')
async def register_user(request: Request):
    connection = connection_start()
    cur = connection.cursor()
    data = await request.json()
    cur.execute(f"SELECT * FROM users WHERE username = '{data['username']}'")
    from_db_username = cur.fetchone()
    cur.execute(f"SELECT * FROM users WHERE email = '{data['email']}'")
    from_db_email = cur.fetchone()
    if from_db_username:
        return JSONResponse(content={"message": "Пользователь с таким именем уже существует!"}, status_code=bad_auth)
    if from_db_email:
        return JSONResponse(content={"message": "Пожалуйста, используйте другую почту, пользователь с такой почтой уже есть!"}, status_code=bad_auth)
    bytes_password = bytearray(hash_password(data['password']))
    cur.execute("INSERT INTO users (username, hashsalt, email) VALUES (%s, %s, %s)",
                (data['username'], bytes_password, data['email']))
    connection.commit()
    connection.close()
    token = "".join([random.choice(generate_token) for _ in range(len_token)])
    new_user(token, data['username'])
    return JSONResponse(content={"token": token}, status_code=200)


@router_auth.post('/api/auth/login')
async def login_user(request: Request):
    input_data = await request.json()
    connection = connection_start()
    cur = connection.cursor()
    cur.execute(f"SELECT username, hashsalt FROM users where username = '{input_data['username']}'")
    find_user = cur.fetchone()
    if not find_user:
        return JSONResponse(content={"message": "Этот пользователь не найден"}, status_code=bad_auth)
    true_pwd = find_user[1]
    if not check_password(true_pwd, input_data['password']):
        return JSONResponse(content={"message": "Неверный пароль, введите еще раз!"}, status_code=bad_auth)
    token = "".join([random.choice(generate_token) for _ in range(len_token)])
    new_user(token, input_data['username'])
    connection.close()
    return JSONResponse(content={"token": token}, status_code=200)
