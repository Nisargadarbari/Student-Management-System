from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from supabase import create_client, Client

app = Flask(__name__)
CORS(app)

# Supabase Configuration
# These should be set as Environment Variables in Vercel
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY')

supabase: Client = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route('/api/signup', methods=['POST'])
def signup():
    if not supabase:
        return jsonify({"success": False, "message": "Database not configured. Set SUPABASE_URL and SUPABASE_KEY."}), 500
    
    try:
        data = request.json
        
        # Check if USN exists
        existing = supabase.table('students').select('usn').eq('usn', data['usn']).execute()
        if existing.data:
            return jsonify({"success": False, "message": "USN already exists"}), 400
            
        new_row = {
            'name': data['name'],
            'usn': data['usn'],
            'dept': data['dept'],
            'student_id': data['studentId'],
            'marks': float(data['marks']),
            'attendance': 0,
            'fee_status': 'Pending',
            'paid_fees': 0,
            'total_fees': 50000
        }
        
        result = supabase.table('students').insert(new_row).execute()
        
        return jsonify({"success": True, "message": "User registered successfully"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    if not supabase:
        return jsonify({"success": False, "message": "Database not configured."}), 500
        
    try:
        data = request.json
        
        # Query user by name (case-insensitive-ish) and USN
        result = supabase.table('students').select('*').eq('usn', data['usn']).execute()
        
        if result.data:
            user_data = result.data[0]
            # Simple name check (matching your previous logic)
            if user_data['name'].lower() == data['name'].lower():
                formatted_user = {
                    "name": user_data['name'],
                    "usn": user_data['usn'],
                    "dept": user_data['dept'],
                    "studentId": user_data['student_id'],
                    "marks": user_data['marks'],
                    "attendance": user_data.get('attendance', 0),
                    "feeStatus": user_data.get('fee_status', 'Pending'),
                    "paidFees": user_data.get('paid_fees', 0),
                    "totalFees": user_data.get('total_fees', 0)
                }
                return jsonify({"success": True, "user": formatted_user})
        
        return jsonify({"success": False, "message": "Invalid Name or USN"}), 401
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
