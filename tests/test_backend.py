import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from main import app, get_db, Base, SessionLocal, engine

# --- Fixtures ---

@pytest.fixture(scope="session")
def db_session():
    """
    Provides a database session for tests.
    Uses an in-memory SQLite database for isolation.
    """
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture(scope="module")
def client():
    """
    Provides a TestClient for making requests to the FastAPI application.
    """
    with TestClient(app) as c:
        yield c

# --- Test Cases ---

def test_read_root(client):
   response = client.get("/")
   assert response.status_code == 200
   assert response.json() == {"message": "Welcome to the Calculator API"}

def test_calculate_add(client, db_session):
   response = client.post("/calculate/add", json={"num1": 5, "num2": 3})
   assert response.status_code == 200
   assert response.json()["result"] == 8

def test_calculate_add_invalid(client, db_session):
   response = client.post("/calculate/add", json={"num1": "five", "num2": 3})
   assert response.status_code == 422 

from models.py import History 
from schemas.py import HistoryEntry 

def test_create_history_entry(client, db_session):
    response = client.post("/history/", json={"operation": "add", "result": 10})
    assert response.status_code == 200
    created_entry = response.json()
    assert created_entry["operation"] == "add"
    assert created_entry["result"] == 10
    entry_in_db = db_session.query(History).filter(History.id == created_entry["id"]).first()
    assert entry_in_db is not None
    assert entry_in_db.operation == "add"
    assert entry_in_db.result == 10

def test_get_history_entries(client, db_session):
    entry1 = History(operation="subtract", result=5)
    entry2 = History(operation="multiply", result=12)
    db_session.add_all([entry1, entry2])
    db_session.commit()

    response = client.get("/history/")
    assert response.status_code == 200
    history_list = response.json()
    operations = [item["operation"] for item in history_list]
    results = [item["result"] for item in history_list]

    assert "subtract" in operations
    assert 5 in results
    assert "multiply" in operations
    assert 12 in results