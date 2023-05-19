from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from change_password import hash_password, connection, check_password
import jwt
from config import *


router_auth = APIRouter()

bad_auth = 401


@router_auth.post('/api/auth/register')
async def register_user(request: Request):
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
    token = jwt.encode(data, SECRET_KEY_FOR_TOKEN, algorithm="HS256")
    print(jwt.decode(token, SECRET_KEY_FOR_TOKEN, algorithms=["HS256"]))
    return JSONResponse(content={"token": token}, status_code=200)


@router_auth.post('/api/auth/login')
async def login_user(request: Request):
    input_data = await request.json()
    cur = connection.cursor()
    cur.execute(f"SELECT username, hashsalt FROM users where username = '{input_data['username']}'")
    find_user = cur.fetchone()
    if not find_user:
        return JSONResponse(content={"message": "Этот пользователь не найден"}, status_code=bad_auth)
    true_pwd = find_user[1]
    if not check_password(true_pwd, input_data['password']):
        return JSONResponse(content={"message": "Неверный пароль, введите еще раз!"}, status_code=bad_auth)
    token = jwt.encode(input_data, "test string")
    return JSONResponse(content={"token": token}, status_code=200)
