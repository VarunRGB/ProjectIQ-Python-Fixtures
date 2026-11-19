"""Reviewed D2 FastAPI + SQLite acceptance fixture; no external services."""
from contextlib import asynccontextmanager
from pathlib import Path
import sqlite3
from tempfile import TemporaryDirectory

from fastapi import FastAPI


@asynccontextmanager
async def lifespan(application: FastAPI):
    # This startup must finish before Uvicorn serves the OpenAPI readiness probe.
    with TemporaryDirectory(prefix="projectiq-d2-") as temporary_dir:
        database = Path(temporary_dir) / "acceptance.sqlite3"
        with sqlite3.connect(database) as connection:
            connection.execute("CREATE TABLE acceptance (id INTEGER PRIMARY KEY, value TEXT NOT NULL)")
            connection.execute("INSERT INTO acceptance (value) VALUES (?)", ("created",))
            connection.commit()
            result = connection.execute("SELECT value FROM acceptance WHERE id = 1").fetchone()
            if result != ("created",):
                raise RuntimeError("SQLite insert/read verification failed")
            connection.execute("UPDATE acceptance SET value = ? WHERE id = 1", ("updated",))
            connection.commit()
            result = connection.execute("SELECT value FROM acceptance WHERE id = 1").fetchone()
            if result != ("updated",):
                raise RuntimeError("SQLite update verification failed")
            connection.execute("DELETE FROM acceptance WHERE id = 1")
            connection.commit()
            count = connection.execute("SELECT COUNT(*) FROM acceptance").fetchone()[0]
            if count != 0 or not database.is_file():
                raise RuntimeError("SQLite delete/file verification failed")
        application.state.sqlite_verified = True
        yield


app = FastAPI(lifespan=lifespan, title="ProjectIQ D2 FastAPI SQLite acceptance")


@app.get("/")
def health():
    return {"service": "projectiq-fastapi-fixture", "status": "ok"}


@app.get("/sqlite-check")
def sqlite_check():
    return {"sqlite_verified_at_startup": bool(app.state.sqlite_verified)}
