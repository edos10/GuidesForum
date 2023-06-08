# GuidesForum

Это веб-приложение на JavaScript + Python 3 с использованием фреймворков FastAPI и ReactJS, а также РСУБД PostgreSQL и in-memory key-value хранилищем данных Redis.

Приложение надо запускать так:

Сервер:
1) cd backend
2) cd FastAPIback
3) python main.py

Клиент:
1) cd frontend
2) cd guides
3) npm start

Redis:
1) redis-server
2) redis-cli
3) вводим пароль $pwd командой:
   CONFIG set requirepass $pwd

PostgreSQL запустится сам с Python скриптом.
