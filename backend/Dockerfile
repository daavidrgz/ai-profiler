FROM python:3.10.12-bullseye

WORKDIR /app

ADD src .
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

RUN python -c "import nltk; nltk.download('stopwords')"

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]