from flask import Flask, request
from flask_cors import CORS, cross_origin
import jwt
import psycopg2
from config import *
import pymorphy3


app = Flask(__name__)
app.secret_key = 'secret string'
CORS(app, support_credentials=True)
cors = CORS(app, resource={
    r"/*": {
        "origins": "*"
    }
})

connection = psycopg2.connect(
    host=DB_HOST,
    dbname=DB_NAME,
    user=DB_USER,
    password=DB_PASS
)


@app.route('/api/auth/login', methods=['POST'])
def login_user():
    input_data = request.get_json()
    cur = connection.cursor()
    cur.execute(f"SELECT username, password FROM users where username = '{input_data['username']}'")
    find_user = cur.fetchone()
    if not find_user:
        return {"message": "Этот пользователь не найден"}, 201
    true_pwd = find_user[1]
    if input_data['password'] != true_pwd:
        return {"message": "Неверный пароль, введите еще раз!"}, 201
    token = jwt.encode(input_data, "test string")
    return {"token": token}, 200


@app.route('/api/new_post', methods=['POST'])
def new_guide():
    input_data = request.get_json()
    cur = connection.cursor()
    cur.execute("SELECT id FROM guides")
    new_id = len(cur.fetchall()) + 1
    tags_str = []
    for tag in input_data['tags']:
        tags_str.append(tag + " 0")
    cur.execute("INSERT INTO guides (id, title, description, tags, date, author) VALUES (%s, %s, %s, %s, %s, %s)",
                (new_id, input_data['title'], input_data['desc'], tags_str, input_data['date'], input_data['author']))
    connection.commit()
    return {"message": "ok"}, 200


@app.route('/api/auth/register', methods=['POST'])
def register_user():
    cur = connection.cursor()
    data = request.get_json()
    cur.execute(f"SELECT * FROM users WHERE username = '{data['username']}'")
    from_db = cur.fetchone()
    if from_db:
        return {"message": "user already exists"}, 201
    cur.execute("INSERT INTO users (username, password, email) VALUES (%s, %s, %s)",
                (data['username'], data['password'], data['email']))
    connection.commit()
    token = jwt.encode(data, app.secret_key, algorithm="HS256")
    print(jwt.decode(token, app.secret_key, algorithms=["HS256"]))
    return {"token": token}, 200


@app.route('/api/profile/<int:id_guide>', methods=['OPTIONS', 'POST'])
@cross_origin(supports_credentials=True)
def profile_user(id_guide):
    x = id_guide
    print(request.get_json())


def get_info_for_guide(input_data: str, par1, par2):
    if not input_data:
        return []
    print(input_data)
    output = []
    for element in input_data:
        element = element.split()
        output.append({par1: element[0], par2: element[1]})
    return output


def get_comments_for_guide(input_data: str):
    if not input_data:
        return []
    output = []
    for element in input_data:
        element = element.split()
        output.append({"author": element[0], "text": element[1]})
    return output


@app.route("/api/view/<int:guide_id>", methods=["PUT"])
def to_up_views(guide_id):
    cur = connection.cursor()
    cur.execute(f"UPDATE guides SET views = views + 1 WHERE id = {guide_id}")
    connection.commit()
    return {}, 200


@app.route('/api/get_guide/<int:guide_id>', methods=['PUT'])
def get_guide(guide_id):
    cur = connection.cursor()
    cur.execute(f"SELECT * from guides WHERE id = {guide_id}")
    find_id = cur.fetchone()
    if not find_id:
        return {"message": "Такого гайда не существует!"}, 201
    print(find_id)
    cur.execute(f"UPDATE guides SET views = views + 1 WHERE id = {guide_id}")
    connection.commit()
    tags_json = get_info_for_guide(find_id[TAGS], "name", "rating")
    comments_json = get_info_for_guide(find_id[COMMENTS], "author", "text")
    return {"title": find_id[TITLE], "tags": tags_json, "releaseDate": find_id[DATE], "text": find_id[DESCRIPTION],
            "comments": comments_json, "views": find_id[VIEWS]}, 200


@app.route('/api/get_top10', methods=['GET'])
def get_top10_guides():
    output_data = []
    cur = connection.cursor()
    cur.execute("""
                   SELECT * from guides 
                   order by views desc limit 10
                   """)
    from_db_data = cur.fetchall()
    for element in from_db_data:
        print(element)
        tags_json = get_info_for_guide(element[TAGS], "name", "rating")
        comments_json = get_info_for_guide(element[COMMENTS], "author", "text")
        output_data.append({"title": element[TITLE], "tags": tags_json, "releaseDate": element[DATE], "text": element[DESCRIPTION],
                "comments": comments_json, "views": element[VIEWS], "author": element[AUTHOR], })
    return output_data, 200


@app.after_request
def handle_options(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, X-Requested-With"
    return response


@app.route('/api/increase_rating', methods=['POST'])
def increase_rating():
    input_data = request.get_json()
    with connection.cursor() as cur:
        cur.execute("UPDATE guides SET ")
        pass
    connection.commit()
    cur.close()
    return {}, 200


@app.route('/api/decrease_rating', methods=['POST'])
def decrease_rating():
    input_data = request.get_json()
    print(input_data)
    with connection.cursor() as cur:
        cur.execute("UPDATE * from guides")
        x = cur.fetchall()
        print(x)

    connection.commit()
    cur.close()
    return {}, 200

if __name__ == '__main__':
    app.run(debug=True)
