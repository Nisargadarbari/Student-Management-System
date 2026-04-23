from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from pymongo import MongoClient
from dotenv import load_dotenv
import certifi

load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB Configuration
MONGO_URI = os.environ.get('MONGODB_URI')
client = MongoClient(MONGO_URI, tlsCAFile=certifi.where()) if MONGO_URI else None
db = client['student_portal'] if client else None
students_col = db['students'] if db is not None else None

@app.route('/api/signup', methods=['POST'])
def signup():
    if students_col is None:
        return jsonify({"success": False, "message": "Database not connected. Set MONGODB_URI."}), 500
    
    try:
        data = request.json
        # Check if USN exists
        if students_col.find_one({"usn": data['usn']}):
            return jsonify({"success": False, "message": "USN already exists"}), 400
            
        new_student = {
            "name": data['name'],
            "usn": data['usn'],
            "dept": data['dept'],
            "student_id": data['studentId'],
            "marks": float(data['marks']),
            "attendance": 85,  # Default
            "fee_status": "Paid",
            "paid_fees": 45000,
            "total_fees": 50000,
            "subjects": [
                {"name": "Computer Networks", "code": "CN", "credits": 4, "prof": "Dr. James Bond"},
                {"name": "Operating Systems", "code": "OS", "credits": 4, "prof": "Dr. Linda Gray"},
                {"name": "Database Systems", "code": "DBMS", "credits": 4, "prof": "Prof. Sarah Smith"}
            ],
            "attendance_details": [
                {"subject": "Computer Networks", "total": 45, "attended": 40, "percent": 88},
                {"subject": "Operating Systems", "total": 42, "attended": 32, "percent": 76},
                {"subject": "Database Systems", "total": 40, "attended": 38, "percent": 95}
            ],
            "semester_results": [
                {"sem": "Semester 1", "sgpa": 8.5, "credits": 22, "result": "Pass"},
                {"sem": "Semester 2", "sgpa": 8.2, "credits": 24, "result": "Pass"}
            ],
            "assignments": [
                {"subject": "Database Systems", "title": "ER Diagram Implementation", "due": "In 3 days", "desc": "Create a complete ER diagram for a hospital management system."}
            ],
            "notifications": [
                {"title": "Holiday Announcement", "desc": "The college will remain closed on Friday due to local festival.", "time": "3 days ago"},
                {"title": "Internal Assessment", "desc": "Results for IA-1 have been published.", "time": "2 hours ago"}
            ]
        }
        
        students_col.insert_one(new_student)
        return jsonify({"success": True, "message": "Registration successful!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    if students_col is None:
        return jsonify({"success": False, "message": "Database not connected."}), 500
        
    try:
        data = request.json
        user = students_col.find_one({"usn": data['usn']})
        
        if user and user['name'].lower() == data['name'].lower():
            # Convert ObjectId to string or remove it
            user['_id'] = str(user['_id'])
            return jsonify({
                "success": True, 
                "user": user
            })
        
        return jsonify({"success": False, "message": "Invalid Name or USN"}), 401
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/update-profile', methods=['POST'])
def update_profile():
    if students_col is None:
        return jsonify({"success": False, "message": "Database not connected."}), 500
        
    try:
        data = request.json
        usn = data.get('usn')
        update_data = data.get('updates')
        
        result = students_col.update_one({"usn": usn}, {"$set": update_data})
        
        if result.modified_count > 0:
            updated_user = students_col.find_one({"usn": usn})
            updated_user['_id'] = str(updated_user['_id'])
            return jsonify({"success": True, "user": updated_user})
        
        return jsonify({"success": False, "message": "No changes made"}), 400
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5002)
