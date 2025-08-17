from flask import Flask, request, jsonify
from flask_cors import CORS
from model import db, Task

app = Flask(__name__)
CORS(app)

# Config do banco SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Criar tabelas
with app.app_context():
    db.create_all()

# Rotas -----------------------

@app.route("/tasks", methods=["GET"])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([t.to_dict() for t in tasks])

@app.route("/tasks", methods=["POST"])
def add_task():
    data = request.json
    new_task = Task(title=data["title"], done=False)
    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.to_dict())

@app.route("/tasks/<int:id>", methods=["PUT"])
def update_task(id):
    task = Task.query.get(id)
    if not task:
        return jsonify({"error": "Tarefa não encontrada"}), 404
    data = request.json
    task.done = data.get("done", task.done)
    db.session.commit()
    return jsonify(task.to_dict())

@app.route("/tasks/<int:id>", methods=["DELETE"])
def delete_task(id):
    task = Task.query.get(id)
    if not task:
        return jsonify({"error": "Tarefa não encontrada"}), 404
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Tarefa deletada!"})

if __name__ == "__main__":
    app.run(debug=True)