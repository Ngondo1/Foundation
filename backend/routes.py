from flask import Blueprint, render_template, request, redirect, url_for, flash, make_response, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
from app import db
from models import User

main = Blueprint('main', __name__)

JWT_SECRET = 'your_secret_key_here'
JWT_ALGORITHM = 'HS256'
JWT_EXP_DELTA_SECONDS = 3600

def create_jwt_token(user):
    payload = {
        'user_id': user.id,
        'username': user.username,
        'role': user.role,
        'exp': datetime.utcnow() + timedelta(seconds=JWT_EXP_DELTA_SECONDS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_jwt_token(token):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def get_current_user():
    token = request.cookies.get('jwt_token')
    if not token:
        return None
    payload = decode_jwt_token(token)
    if not payload:
        return None
    user = User.query.get(payload['user_id'])
    return user

@main.route('/')
def index():
    user = get_current_user()
    return render_template('index.html', user=user)

@main.route('/donate', methods=['GET', 'POST'])
def donate():
    if request.method == 'POST':
        flash('Thank you for your donation!', 'success')
        return redirect(url_for('main.donate'))
    return render_template('donate.html')

@main.route('/events')
def events():
    return render_template('events.html')

@main.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username, role='admin').first()
        if user and check_password_hash(user.password, password):
            token = create_jwt_token(user)
            resp = make_response(redirect(url_for('main.index')))
            resp.set_cookie('jwt_token', token, httponly=True, samesite='Lax')
            return resp
        else:
            flash('Invalid admin credentials', 'danger')
    return render_template('admin_login.html')

@main.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            token = create_jwt_token(user)
            resp = make_response(redirect(url_for('main.index')))
            resp.set_cookie('jwt_token', token, httponly=True, samesite='Lax')
            return resp
        else:
            flash('Invalid credentials', 'danger')
    return render_template('login.html')

@main.route('/logout')
def logout():
    resp = make_response(redirect(url_for('main.index')))
    resp.set_cookie('jwt_token', '', expires=0)
    return resp

@main.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if User.query.filter_by(username=username).first():
            flash('Username already exists', 'danger')
            return redirect(url_for('main.register'))
        hashed_pw = generate_password_hash(password)
        user = User(username=username, password=hashed_pw, role='user')
        db.session.add(user)
        db.session.commit()
        flash('Registration successful! Please log in.', 'success')
        return redirect(url_for('main.login'))
    return render_template('register.html')

# Example protected route
@main.route('/dashboard')
def dashboard():
    user = get_current_user()
    if not user:
        return redirect(url_for('main.login'))
    return render_template('dashboard.html', user=user)



@main.route('/book/mombasa', methods=['GET', 'POST'])
def mombasa_booking():
    if request.method == 'POST':
        flash('Booking received for Mombasa!', 'success')
        return redirect(url_for('main.mombasa_booking'))
    return render_template('mombasa_booking.html')

@main.route('/book/nyahururu', methods=['GET', 'POST'])
def nyahururu_booking():
    if request.method == 'POST':
        data = request.get_json()
        name = data.get('name')
        phone = data.get('phone')
        preferences = data.get('preferences')
        amount = 11750  # Total for Nyahururu

        # Format phone to 2547XXXXXXXX
        if phone.startswith('0'):
            phone = '254' + phone[1:]
        elif phone.startswith('+'):
            phone = phone[1:]

        # === MPESA DARAJA SANDBOX INTEGRATION ===
        consumer_key = "YOUR_CONSUMER_KEY"
        consumer_secret = "YOUR_CONSUMER_SECRET"
        shortcode = "174379"  # Sandbox paybill
        passkey = "YOUR_PASSKEY"
        callback_url = "https://yourdomain.com/mpesa/callback"  # Can be a dummy for sandbox

        # 1. Get access token
        auth_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        auth_response = requests.get(auth_url, auth=(consumer_key, consumer_secret))
        access_token = auth_response.json().get('access_token')

        # 2. Prepare STK Push
        import base64
        from datetime import datetime
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password = base64.b64encode((shortcode + passkey + timestamp).encode()).decode()

        stk_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        payload = {
            "BusinessShortCode": shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": phone,
            "PartyB": shortcode,
            "PhoneNumber": phone,
            "CallBackURL": callback_url,
            "AccountReference": "NyahururuBooking",
            "TransactionDesc": f"Booking for {name}"
        }
        stk_response = requests.post(stk_url, headers=headers, json=payload)
        stk_data = stk_response.json()

        if stk_response.status_code == 200 and stk_data.get("ResponseCode") == "0":
            return jsonify({"success": True})
        else:
            return jsonify({"success": False, "error": stk_data.get("errorMessage", "Could not initiate payment")})

    return render_template('nyahururu_booking.html')

import requests
from flask import request, jsonify, render_template

@main.route('/book/machakos', methods=['GET', 'POST'])
def machakos_booking():
    if request.method == 'POST':
        data = request.get_json()
        name = data.get('name')
        phone = data.get('phone')
        preferences = data.get('preferences')
        amount = 9500  # or whatever total you want

        # Format phone to 2547XXXXXXXX
        if phone.startswith('0'):
            phone = '254' + phone[1:]
        elif phone.startswith('+'):
            phone = phone[1:]

        # === MPESA DARAJA SANDBOX INTEGRATION ===
        consumer_key = "YOUR_CONSUMER_KEY"
        consumer_secret = "YOUR_CONSUMER_SECRET"
        shortcode = "174379"  # Sandbox paybill
        passkey = "YOUR_PASSKEY"
        callback_url = "https://yourdomain.com/mpesa/callback"  # Can be a dummy for sandbox

        # 1. Get access token
        auth_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        auth_response = requests.get(auth_url, auth=(consumer_key, consumer_secret))
        access_token = auth_response.json().get('access_token')

        # 2. Prepare STK Push
        import base64
        from datetime import datetime
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password = base64.b64encode((shortcode + passkey + timestamp).encode()).decode()

        stk_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        payload = {
            "BusinessShortCode": shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": phone,
            "PartyB": shortcode,
            "PhoneNumber": phone,
            "CallBackURL": callback_url,
            "AccountReference": "MachakosBooking",
            "TransactionDesc": f"Booking for {name}"
        }
        stk_response = requests.post(stk_url, headers=headers, json=payload)
        stk_data = stk_response.json()

        if stk_response.status_code == 200 and stk_data.get("ResponseCode") == "0":
            return jsonify({"success": True})
        else:
            return jsonify({"success": False, "error": stk_data.get("errorMessage", "Could not initiate payment")})

    return render_template('machakos_booking.html')