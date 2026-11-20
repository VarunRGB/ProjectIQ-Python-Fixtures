ProjectIQ D4a — Reviewed Fullstack Pilot Fixture

This is a TEST FIXTURE, not a production student project.

frontend/: React + Vite build, with a browser client call to /api/sqlite-check
backend/: Express 4 API + Node 24 built-in SQLite (node:sqlite)

Both package.json/package-lock.json pairs are retained from already-reviewed,
immutable upstream commits. setup_d4_fixture.ps1 downloads the Vite pair and
verifies Git blob hashes; Express pair comes from the existing d3-express branch.

A trusted Python frontend server in the *disposable offline VM* serves built
HTML/JS and proxies /api/* to Express on 127.0.0.1:8766. A GET to the frontend
proxy /api/sqlite-check triggers real SQLite create/insert/read/update/delete
operations in a throwaway guest-local database. D4a does not test actual browser
rendering or production sandbox isolation.

The PowerShell setup script creates and stages a new 'd4-fullstack' fixture
branch without committing or pushing. Review before manually approving SHA.
