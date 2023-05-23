import redis
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from config import *


router_for_check = APIRouter()

new_redis = redis.StrictRedis(
        host=HOST_FOR_REDIS,
        port=PORT_REDIS,
        username="default",
        password=PASSWORD_FOR_REDIS,
        charset="utf-8",
    )


def new_user(token: str, data: str):
    new_redis.set(token, data, SESSION_DURATION)
    print(new_redis.get(token))
    pass


@router_for_check.post('/api/check_auth')
async def check_user(request: Request):
    data = await request.json()
    token = data['token']
    is_auth = False
    if token and new_redis.get(token):
        is_auth = True
    print(is_auth)
    return JSONResponse({"isAuth": is_auth}, status_code=200)