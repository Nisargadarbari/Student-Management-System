from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# Use /tmp for writable storage on Vercel, or local path for local dev
if os.environ.get('VERCEL'):
    EXCEL_FILE = '/tmp/students.xlsx'
else:
    EXCEL_FILE = 'students.xlsx'

# Initialize Excel file
def init_excel():
    if not os.path.exists(EXCEL_FILE):
        # If running on Vercel, try to copy the initial one from the repo if it exists
        repo_file = 'students.xlsx'
        if os.path.exists(repo_file) and os.environ.get('VERCEL'):
            import shutil
            shutil.copy(repo_file, EXCEL_FILE)
        else:
            columns = [
                'Name', 'USN', 'Department', 'StudentID', 'Marks', 
                'Attendance', 'FeeStatus', 'PaidFees', 'TotalFees'
            ]
            df = pd.DataFrame(columns=columns)
            df.to_excel(EXCEL_FILE, index=False)

@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        init_excel()
        data = request.json
        df = pd.read_excel(EXCEL_FILE)
        
        if data['usn'] in df['USN'].values:
            return jsonify({"success": False, "message": "USN already exists"}), 400
            
        new_row = {
            'Name': data['name'],
            'USN': data['usn'],
            'Department': data['dept'],
            'StudentID': data['studentId'],
            'Marks': data['marks'],
            'Attendance': 0,
            'FeeStatus': 'Pending',
            'PaidFees': 0,
            'TotalFees': 50000
        }
        
        df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
        df.to_excel(EXCEL_FILE, index=False)
        
        return jsonify({"success": True, "message": "User registered successfully"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        init_excel()
        data = request.json
        df = pd.read_excel(EXCEL_FILE)
        
        user_row = df[(df['Name'].str.lower() == data['name'].lower()) & (df['USN'] == data['usn'])]
        
        if not user_row.empty:
            user_data = user_row.iloc[0].to_dict()
            formatted_user = {
                "name": user_data['Name'],
                "usn": user_data['USN'],
                "dept": user_data['Department'],
                "studentId": user_data['StudentID'],
                "marks": user_data['Marks'],
                "attendance": user_data.get('Attendance', 0),
                "feeStatus": user_data.get('FeeStatus', 'Pending'),
                "paidFees": user_data.get('PaidFees', 0),
                "totalFees": user_data.get('TotalFees', 0)
            }
            return jsonify({"success": True, "user": formatted_user})
        else:
            return jsonify({"success": False, "message": "Invalid Name or USN"}), 401
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# For Vercel, we don't need app.run()
if __name__ == '__main__':
    init_excel()
    app.run(debug=True, port=5000)
