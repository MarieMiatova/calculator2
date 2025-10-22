# 🧮 Калькулятор с историей вычислений

https://calculatormanefabulent.netlify.app/

Полнофункциональное веб-приложение калькулятора, которое позволяет выполнять арифметические операции и сохранять историю вычислений в базе данных PostgreSQL.  
Frontend размещён на **Netlify**, а backend и база данных — на **Render**.

---

## 🚀 Демонстрация

🔗 **Frontend (Netlify):** [https://calculatormanefabulent.netlify.app/](https://calculatormanefabulent.netlify.app/)  
🔗 **Backend (Render API):** `https://calculator2-9ae5.onrender.com/api`

---

## 🏗️ Архитектура проекта
```bash
project/
├── backend/
│ ├── app/
│ │ ├── main.py # Точка входа FastAPI
│ │ ├── models.py # SQLAlchemy-модели (History)
│ │ ├── schemas.py # Pydantic-схемы
│ │ ├── database.py # Подключение к БД
│ ├── requirements.txt
│ ├── Dockerfile
│ ├── docker-compose.yml
│
├── frontend/
│ ├── src/
│ │ ├── main.ts # Основная логика интерфейса
│ │ ├── calculator.ts # Парсер и вычислитель выражений
│ │ ├── api.ts # API-запросы к backend
│ │ ├── config.ts # Конфигурация API URL
│ │ └── types.ts
│ ├── vite.config.ts
│ ├── package.json
│ └── .env
│
├── tests/
│ ├── test_backend.py # Тесты FastAPI
│ ├── example.spec.js # E2E-тесты Playwright
│
└── README.md
```



## ⚙️ Технологии

### 🔹 Backend
- **Python 3.11**
- **FastAPI**
- **SQLAlchemy**
- **PostgreSQL**
- **Docker / Docker Compose**
- **Uvicorn**

### 🔹 Frontend
- **Vite + TypeScript**
- **Vanilla JS + DOM API**
- **CSS3 (адаптивная верстка)**

### 🔹 DevOps & Deployment
- **Render** — API и база данных
- **Netlify** — frontend
- **Docker** — контейнеризация backend
- **Playwright** — e2e тестирование

## 🧰 Установка и локальный запуск

### 1. Клонирование репозитория
```bash
[[git clone https://github.com/MarieMiatova/calculator2.git
cd calculator2
```

2. Backend
Запуск через Docker Compose
```bash
cd backend
docker-compose up --build
```


Без Docker
```bash
cd backend
python -m venv venv
source venv/bin/activate  
pip install -r requirements.txt
uvicorn app.main:app --reload
```


3. Frontend
Установка зависимостей и запуск
```bash
cd frontend
npm install
npm run dev
```

4. Тестирование
Unit-тесты (backend)
```bash
pytest tests/test_backend.py -v
```

E2E-тесты (frontend)
```bash
npx playwright test
```

## Возможности приложения

✅ Выполнение математических операций (+, −, ×, ÷, %, ^)

✅ Корректная обработка ошибок (деление на ноль, неверное выражение и т.п.)

✅ Сохранение и отображение истории

✅ Очистка истории на фронтенде

✅ Кроссбраузерная адаптивная верстка

✅ REST API с CORS-доступом

✅ Автоматическая публикация на Render и Netlify


## Авторы

Разработчики: [Стекольникова Манефа и Аларслан Бюлент]
🌐 GitHub: https://github.com/MarieMiatova и https://github.com/Bulentor 
