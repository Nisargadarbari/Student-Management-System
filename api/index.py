from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd
from dotenv import load_dotenv

# Load .env file for local development
load_dotenv()

app = Flask(__name__)
CORS(app)

# --- Database Selection ---
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY')

USING_SUPABASE = False
supabase = None

if SUPABASE_URL and SUPABASE_KEY:
    try:
        from supabase import create_client, Client
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        USING_SUPABASE = True
        print("✅ Using Supabase Database")
    except ImportError:
        print("⚠️ Supabase library not found. Falling back to Excel.")

if not USING_SUPABASE:
    EXCEL_FILE = '/tmp/students.xlsx' if os.environ.get('VERCEL') else 'students.xlsx'
    print(f"📁 Using Excel Database: {EXCEL_FILE}")

# --- Helper Functions ---
def init_excel():
    if not USING_SUPABASE and not os.path.exists(EXCEL_FILE):
        columns = ['Name', 'USN', 'Department', 'StudentID', 'Marks', 'Attendance', 'FeeStatus', 'PaidFees', 'TotalFees']
        df = pd.DataFrame(columns=columns)
        df.to_excel(EXCEL_FILE, index=False)

# --- API Routes ---
@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        
        if USING_SUPABASE:
            # Supabase Signup
            existing = supabase.table('students').select('usn').eq('usn', data['usn']).execute()
            if existing.data:
                return jsonify({"success": False, "message": "USN already exists"}), 400
            
            new_row = {
                'name': data['name'], 'usn': data['usn'], 'dept': data['dept'],
                'student_id': data['studentId'], 'marks': float(data['marks']),
                'attendance': 0, 'fee_status': 'Pending', 'paid_fees': 0, 'total_fees': 50000
            }
            supabase.table('students').insert(new_row).execute()
        else:
            # Excel Signup
            init_excel()
            df = pd.read_excel(EXCEL_FILE)
            if data['usn'] in df['USN'].values:
                return jsonify({"success": False, "message": "USN already exists"}), 400
            
            new_row = {
                'Name': data['name'], 'USN': data['usn'], 'Department': data['dept'],
                'StudentID': data['studentId'], 'Marks': data['marks'],
                'Attendance': 0, 'FeeStatus': 'Pending', 'PaidFees': 0, 'TotalFees': 50000
            }
            df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
            df.to_excel(EXCEL_FILE, index=False)

        return jsonify({"success": True, "message": "User registered successfully"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        
        if USING_SUPABASE:
            result = supabase.table('students').select('*').eq('usn', data['usn']).execute()
            if result.data:
                user = result.data[0]
                if user['name'].lower() == data['name'].lower():
                    return jsonify({"success": True, "user": {
                        "name": user['name'], "usn": user['usn'], "dept": user['dept'],
                        "studentId": user['student_id'], "marks": user['marks'],
                        "attendance": user.get('attendance', 0),
                        "feeStatus": user.get('fee_status', 'Pending'),
                        "paidFees": user.get('paid_fees', 0),
                        "totalFees": user.get('total_fees', 0)
                    }})
        else:
            init_excel()
            df = pd.read_excel(EXCEL_FILE)
            user_row = df[(df['Name'].str.lower() == data['name'].lower()) & (df['USN'] == data['usn'])]
            if not user_row.empty:
                user = user_row.iloc[0].to_dict()
                return jsonify({"success": True, "user": {
                    "name": user['Name'], "usn": user['USN'], "dept": user['Department'],
                    "studentId": user['StudentID'], "marks": user['Marks'],
                    "attendance": user.get('Attendance', 0),
                    "feeStatus": user.get('FeeStatus', 'Pending'),
                    "paidFees": user.get('PaidFees', 0),
                    "totalFees": user.get('TotalFees', 0)
                }})
        
        return jsonify({"success": False, "message": "Invalid Name or USN"}), 401
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
