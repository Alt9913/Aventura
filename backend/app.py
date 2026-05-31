from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import bcrypt
import jwt
import datetime
import os

app = Flask(__name__)
CORS(app) 
CORS(app, resources={r"/*": {"origins": "*"}})

DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'db': os.getenv('DB_NAME', 'aventura_db'),
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

def get_db_connection():
    return pymysql.connect(**DB_CONFIG)

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    
    
    password = data.get('password').encode('utf-8')
    hashed_pw = bcrypt.hashpw(password, bcrypt.gensalt())

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            sql = "INSERT INTO users (first_name, last_name, email, password_hash) VALUES (%s, %s, %s, %s)"
            cursor.execute(sql, (data.get('firstName'), data.get('lastName'), data.get('email'), hashed_pw))
        connection.commit()
        connection.close()
        return jsonify({"status": "success", "message": "User registriert!"}), 201
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


SECRET_KEY = "aventura_geheim_123"

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password').encode('utf-8')

    connection = get_db_connection()
    with connection.cursor() as cursor:
        sql = "SELECT * FROM users WHERE email = %s"
        cursor.execute(sql, (email,))
        user = cursor.fetchone()
    connection.close()

    if user:
        if bcrypt.checkpw(password, user['password_hash'].encode('utf-8')):
            
            payload = {
                'user_id': user['id'],
                'role': user['role'],
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24) # bitte methode anpassen
            }
            token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
            # -------------------------------

            return jsonify({
                "status": "success", 
                "message": "Login erfolgreich!",
                "token": token, 
                "user": {
                    "firstName": user['first_name'],
                    "role": user['role']
                }
            }), 200
    
    return jsonify({"status": "error", "message": "E-Mail oder Passwort falsch"}), 401


@app.route('/accommodations', methods=['GET'])
def get_accommodations():
    try:
       
        country_param = request.args.get('country')
        
        country_mapping = {
            'norway': 'NO', 'indonesia': 'ID', 'turkey': 'TR', 
            'switzerland': 'CH', 'greece': 'GR', 'south_africa': 'ZA', 
            'brazil': 'BR', 'japan': 'JP'
        }
        
        connection = get_db_connection()
        with connection.cursor() as cursor:
            
            if country_param:
                clean_param = country_param.strip().lower()
                country_code = country_mapping.get(clean_param, clean_param.upper())
                
                
                sql = "SELECT * FROM accommodations WHERE country_code = %s ORDER BY id DESC"
                cursor.execute(sql, (country_code,))
            else:
                
                sql = "SELECT * FROM accommodations ORDER BY id DESC LIMIT 4"
                cursor.execute(sql)
                
            result = cursor.fetchall()
        connection.close()
        return jsonify(result), 200
    except Exception as e:
        print(f"Fehler im Backend bei accommodations: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/country-info', methods=['GET'])
def get_country_info():
    try:
        country_param = request.args.get('country')
        if not country_param:
            return jsonify({"status": "error", "message": "Missing country parameter"}), 400

        
        country_mapping = {
            'norway': 'NO', 'indonesia': 'ID', 'turkey': 'TR', 
            'switzerland': 'CH', 'greece': 'GR', 'south_africa': 'ZA', 
            'brazil': 'BR', 'japan': 'JP'
        }
        clean_param = country_param.strip().lower()
        country_code = country_mapping.get(clean_param, clean_param.upper())

        connection = get_db_connection()
        with connection.cursor() as cursor:
            
            sql = "SELECT * FROM countries WHERE country_code = %s"
            cursor.execute(sql, (country_code,))
            country_info = cursor.fetchone()
        connection.close()

        if country_info:
            return jsonify(country_info), 200
        else:
            return jsonify({"status": "error", "message": "Country not found in DB"}), 404
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/accommodation/<int:acc_id>', methods=['GET'])
def get_single_accommodation(acc_id):
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            
            sql = "SELECT * FROM accommodations WHERE id = %s"
            cursor.execute(sql, (acc_id,))
            accommodation = cursor.fetchone()
        connection.close()

        if accommodation:
            return jsonify(accommodation), 200
        else:
            return jsonify({"status": "error", "message": "Unterkunft nicht gefunden"}), 404
    except Exception as e:
        print(f"Fehler im Backend bei Einzelabfrage: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
    
@app.route('/create-booking', methods=['POST'])
def create_booking():
    try:
        data = request.get_json()
        
        user_name = data.get('user_id')
        accommodation_id = data.get('accommodation_id')
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        if not all([user_name, accommodation_id, start_date, end_date]):
            return jsonify({"status": "error", "message": "Unvollständige Buchungsdaten"}), 400

        connection = get_db_connection()
        with connection.cursor() as cursor:
           
            sql_user = "SELECT id FROM users WHERE first_name = %s"
            cursor.execute(sql_user, (user_name,))
            user_result = cursor.fetchone()
            
            if not user_result:
                connection.close()
                return jsonify({"status": "error", "message": f"Benutzer '{user_name}' nicht gefunden."}), 404
            
            real_user_id = user_result['id']

            
            sql_check_overlap = """
                SELECT id FROM bookings 
                WHERE accommodation_id = %s 
                AND %s < end_date 
                AND %s > start_date
            """
            
            cursor.execute(sql_check_overlap, (accommodation_id, start_date, end_date))
            existing_booking = cursor.fetchone()

            if existing_booking:
                connection.close()
                
                return jsonify({
                    "status": "error", 
                    "message": "Dieser Zeitraum ist für diese Unterkunft leider bereits ausgebucht!"
                }), 409  

            
            sql_booking = """
                INSERT INTO bookings (user_id, accommodation_id, start_date, end_date) 
                VALUES (%s, %s, %s, %s)
            """
            cursor.execute(sql_booking, (real_user_id, accommodation_id, start_date, end_date))
            connection.commit()
            
        connection.close()
        return jsonify({"status": "success", "message": "Buchung erfolgreich abgeschlossen!"}), 201

    except Exception as e:
        print(f"Fehler bei der Buchungserstellung: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/my-bookings', methods=['GET'])
def get_my_bookings():
    try:
        user_name = request.args.get('user')
        if not user_name:
            return jsonify({"status": "error", "message": "Kein Benutzer angegeben"}), 400

        connection = get_db_connection()
        with connection.cursor() as cursor:
            
            sql_user = "SELECT id FROM users WHERE first_name = %s"
            cursor.execute(sql_user, (user_name,))
            user_result = cursor.fetchone()
            
            if not user_result:
                connection.close()
                return jsonify([]) 

            user_id = user_result['id']

            
            sql_bookings = """
                SELECT 
                    b.id AS booking_id,
                    b.start_date,
                    b.end_date,
                    a.title, a.title_en, a.title_ru, a.title_ua, a.title_tr,
                    a.location_name, a.location_name_en, a.location_name_ru, 
                    a.location_name_ua, a.location_name_tr,
                    a.price_per_night,
                    a.image_url
                FROM bookings b
                INNER JOIN accommodations a ON b.accommodation_id = a.id
                WHERE b.user_id = %s
                ORDER BY b.start_date ASC
            """
            cursor.execute(sql_bookings, (user_id,))
            result = cursor.fetchall()
            
        connection.close()
        
        
        for row in result:
            row['start_date'] = row['start_date'].strftime('%Y-%m-%d')
            row['end_date'] = row['end_date'].strftime('%Y-%m-%d')

        return jsonify(result), 200

    except Exception as e:
        print(f"Fehler beim Laden der Profil-Buchungen: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

#if __name__ == '__main__':
    app.run(port=5000, debug=True)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
    
