FROM python:3.9

WORKDIR ./FastAPiback

COPY ./requirements.txt ./FastAPIback/requirements.txt

RUN pip install --no-cache-dir --upgrade -r ./FastAPIback/requirements.txt


COPY ./main.py /FastAPIback/

CMD ["uvicorn", "main:app", "--host", "localhost", "--port", "5000"]
