from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import jwt
from database import *
import psycopg2
from config import *
from change_password import *
import uvicorn
from auth import *
from check_auth import router_for_check

app = FastAPI()
app.include_router(router_auth)
app.include_router(router_for_check)
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Access-Control-Allow-Origin"],
)


@app.options("*")
def handle_options():
    response = JSONResponse({}, status_code=200)
    response.headers["Access-Control-Allow-Origin"] = origins[0]
    response.headers["Access-Control"] = '*'
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, X-Requested-With"
    return response


@app.post('/api/new_post')
async def new_guide(request: Request):
    input_data = await request.json()
    cur = connection.cursor()
    cur.execute("SELECT id FROM guides")
    new_id = len(cur.fetchall()) + 1
    for tag in input_data['tags']:
        cur.execute("INSERT into tags (tagname, guide) VALUES (%s, %s)", (tag, new_id))
    cur.execute("INSERT INTO guides (id, title, description, date, author) VALUES (%s, %s, %s, %s, %s)", 
                (new_id, input_data['title'], input_data['desc'], input_data['date'], input_data['author']))
    connection.commit()
    return JSONResponse(content={"message": "ok"}, status_code=200)


@app.post('/api/profile/{id_guide}')
async def profile_user(id_guide: int, request: Request):
    print(await request.json())


@app.put("/api/view/{guide_id}")
def to_up_views(guide_id: int):
    with connection.cursor() as cur:
        cur.execute(f"UPDATE guides SET views = views + 1 WHERE id = {guide_id}")
    connection.commit()
    return JSONResponse({}, status_code=200)


@app.get('/api/get_guide/{guide_id}')
@app.put('/api/get_guide/{guide_id}')
async def get_guide(guide_id: int, request: Request):
    with connection.cursor() as cur:
        cur.execute("SELECT * FROM guides WHERE id = %s", (guide_id,))
        find_id = cur.fetchone()
        if not find_id:
            return JSONResponse({"message": "Такого гайда не существует!"}, status_code=201)

        if request.method == 'PUT':
            cur.execute("UPDATE guides SET views = views + 1 WHERE id = %s", (guide_id,))
            connection.commit()

        cur.execute("SELECT tagname, rating_plus, rating_minus FROM tags WHERE guide = %s", (guide_id,))
        tags = cur.fetchall()
        tags_json = [element[0] for element in tags]

        cur.execute("SELECT text, author FROM comments WHERE guide = %s", (guide_id,))
        comments = cur.fetchall()
        comments_json = [{"text": element[0], "author": element[1]} for element in comments]
    return JSONResponse({
        "title": find_id[TITLE],
        "tags": tags_json,
        "releaseDate": find_id[DATE],
        "text": find_id[DESCRIPTION],
        "comments": comments_json,
        "views": find_id[VIEWS]
    }, status_code=200)


@app.get('/api/get_top10')
def get_top10_guides():
    output_data = []
    cur = connection.cursor()
    cur.execute("""SELECT * from guides 
                   order by views desc limit 10""")
    from_db_data = cur.fetchall()
    for element in from_db_data:
        output_data.append(
            {"title": element[TITLE], "releaseDate": element[DATE], "text": element[DESCRIPTION],
             "views": element[VIEWS], "author": element[AUTHOR], "id": element[ID]})
    return JSONResponse(output_data, status_code=200)


@app.options("*")
def handle_options():
    response = JSONResponse({}, status_code=200)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control"] = '*'
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, X-Requested-With"
    return response


@app.post('/api/increase_rating')
def increase_rating(input_data: dict):
    with connection.cursor() as cur:
        cur.execute(f"UPDATE tags SET rating = rating + 1 WHERE tagname = '{input_data['tagName']}' AND "
                    f"guide = {input_data['guideId']}")
    connection.commit()
    return JSONResponse({}, status_code=200)


@app.post('/api/decrease_rating')
def increase_rating(input_data: dict):
    with connection.cursor() as cur:
        cur.execute(f"UPDATE tags SET rating = rating - 1 WHERE tagname = '{input_data['tagName']}' AND "
                    f"guide = {input_data['guideId']}")
    connection.commit()
    return JSONResponse({}, status_code=200)


"""without editing of tags"""


@app.post('/api/edit_guide/{guide_id}')
async def edit_guide(guide_id, request: Request):
    input_data = await request.json()
    with connection.cursor() as cur:
        cur.execute("")
        cur.execute(f"UPDATE guides SET title, descr")
    print(input_data)


@app.get('/api/get_profile/{user_id}')
def get_user_profile(user_id):
    pass


@app.put('/api/delete_guide/{guide_id}')
def delete_guide(guide_id, request: Request):
    with connection.cursor() as cur:
        cur.execute(f"DELETE FROM guides WHERE id ='{guide_id}'")
    pass


@app.get('/api/random/{guide_id}')
def random_guide(guide_id):
    pass


@app.get('/api/search')
async def search(request: Request):
    need_find_data = await request.json()
    ...
    pass


@app.post('/api/send_comment')
async def send_comment(request: Request):
    data = await request.json()
    with connection.cursor() as cur:
        cur.execute(f"INSERT into comments (text, author, date, guide) VALUES (%s, %s, %s, %s)",
                    (data['commentText'], data['author'], data['date'], data['guideId']))
    connection.commit()
    print(data)


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="localhost",
        port=5000,
        workers=10
    )
