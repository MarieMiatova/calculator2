FROM python:3.11-slim

WORKDIR /app

# Скопировать только нужные файлы сначала для кеша pip
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Скопировать весь бекенд
COPY . /app

ENV PYTHONUNBUFFERED=1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
