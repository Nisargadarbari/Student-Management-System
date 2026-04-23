from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

# MongoDB Configuration
MONGO_URI = os.environ.get('MONGODB_URI')
client = MongoClient(MONGO_URI) if MONGO_URI else None
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
            "attendance": 0,
            "fee_status": "Pending",
            "paid_fees": 0,
            "total_fees": 50000
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
            return jsonify({
                "success": True, 
                "user": {
                    "name": user['name'],
                    "usn": user['usn'],
                    "dept": user['dept'],
                    "studentId": user['student_id'],
                    "marks": user['marks'],
                    "attendance": user.get('attendance', 0),
                    "feeStatus": user.get('fee_status', 'Pending'),
                    "paidFees": user.get('paid_fees', 0),
                    "totalFees": user.get('total_fees', 0)
                }
            })
        
        return jsonify({"success": False, "message": "Invalid Name or USN"}), 401
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5002)
