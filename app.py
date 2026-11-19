from flask import Flask, jsonify

app = Flask(__name__)

@app.get("/")
def health():
    return jsonify({
        "service": "projectiq-flask-fixture",
        "status": "ok"
    })