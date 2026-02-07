from flask import Blueprint, request, jsonify, abort

users_bp = Blueprint('users', __name__)

# Dummy data for demonstration purposes
users_db = {}

@users_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if username in users_db:
        return jsonify({'error': 'User already exists.'}), 400
    users_db[username] = password  # Save password in a real application use hashing!
    return jsonify({'message': 'User registered successfully!'}), 201

@users_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if username not in users_db or users_db[username] != password:
        return jsonify({'error': 'Invalid credentials.'}), 401
    return jsonify({'message': 'Login successful!'}), 200

@users_bp.route('/profile/<username>', methods=['GET'])
def profile(username):
    if username not in users_db:
        return jsonify({'error': 'User not found.'}), 404
    return jsonify({'username': username}), 200

@users_bp.route('/directory', methods=['GET'])
def directory():
    return jsonify({'users': list(users_db.keys())}), 200

