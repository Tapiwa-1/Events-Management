from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import requests
import bcrypt
import os

app = Flask(__name__)
# In production, this should be set via environment variable
app.secret_key = os.environ.get('SECRET_KEY', 'mobile_secret_key_123_change_in_prod')

API_URL = os.environ.get('MOBILE_API_URL', "http://127.0.0.1:8080/api.php")
API_KEY = "secret_mobile_api_key_2024"

def api_request(method, params=None, json=None):
    headers = {'X-API-Key': API_KEY}
    url = API_URL
    if params:
        query_str = "&".join([f"{k}={v}" for k, v in params.items()])
        url += ("?" if "?" not in url else "&") + query_str

    if method == 'GET':
        return requests.get(url, headers=headers)
    elif method == 'POST':
        return requests.post(url, headers=headers, json=json)
    elif method == 'PUT':
        return requests.put(url, headers=headers, json=json)
    elif method == 'DELETE':
        return requests.delete(url, headers=headers)

@app.route('/')
def index():
    if 'user' not in session:
        return redirect(url_for('login'))

    try:
        events = api_request('GET', params={'table': 'events'}).json()
        inventory = api_request('GET', params={'table': 'inventory_items'}).json()

        stats = {
            'total_events': len(events) if isinstance(events, list) else 0,
            'total_items': len(inventory) if isinstance(inventory, list) else 0,
            'upcoming_events': [e for e in events if e.get('status') == 'planned'][:5] if isinstance(events, list) else []
        }
    except:
        stats = {'total_events': 0, 'total_items': 0, 'upcoming_events': []}

    return render_template('dashboard.html', user=session['user'], stats=stats)

@app.route('/events')
def events():
    if 'user' not in session:
        return redirect(url_for('login'))

    try:
        events_list = api_request('GET', params={'table': 'events'}).json()
        if not isinstance(events_list, list): events_list = []

        clients = api_request('GET', params={'table': 'clients'}).json()
        client_map = {c['id']: c['name'] for c in clients} if isinstance(clients, list) else {}

        for e in events_list:
            e['client_name'] = client_map.get(e['client_id'], 'Unknown')

    except:
        events_list = []

    return render_template('events.html', events=events_list)

@app.route('/events/create', methods=['GET', 'POST'])
def create_event():
    if 'user' not in session:
        return redirect(url_for('login'))

    if request.method == 'POST':
        data = {
            'name': request.form.get('name'),
            'date': request.form.get('date'),
            'location': request.form.get('location'),
            'status': 'planned',
            'client_phone': request.form.get('client_phone'),
            'total_cost': float(request.form.get('total_cost', 0))
        }
        try:
            api_request('POST', params={'table': 'events'}, json=data)
            return redirect(url_for('events'))
        except:
            return "Error creating event"

    return render_template('event_form.html')

@app.route('/inventory')
def inventory():
    if 'user' not in session:
        return redirect(url_for('login'))

    try:
        items = api_request('GET', params={'table': 'inventory_items'}).json()
        if not isinstance(items, list): items = []
    except:
        items = []

    return render_template('inventory.html', items=items)

@app.route('/inventory/update/<int:item_id>', methods=['POST'])
def update_inventory(item_id):
    if 'user' not in session:
        return redirect(url_for('login'))

    data = {
        'total_quantity': int(request.form.get('quantity')),
        'condition': request.form.get('condition')
    }
    try:
        api_request('PUT', params={'table': 'inventory_items', 'id': item_id}, json=data)
    except:
        pass
    return redirect(url_for('inventory'))

@app.route('/business')
def business():
    if 'user' not in session:
        return redirect(url_for('login'))

    try:
        transactions = api_request('GET', params={'table': 'transactions'}).json()
        loans = api_request('GET', params={'table': 'loans'}).json()
    except:
        transactions, loans = [], []

    return render_template('business.html', transactions=transactions, loans=loans)

@app.route('/marketing')
def marketing():
    if 'user' not in session:
        return redirect(url_for('login'))

    try:
        inquiries = api_request('GET', params={'table': 'inquiries'}).json()
    except:
        inquiries = []

    return render_template('marketing.html', inquiries=inquiries)

@app.route('/logistics')
def logistics():
    if 'user' not in session:
        return redirect(url_for('login'))

    try:
        bookings = api_request('GET', params={'table': 'inventory_bookings'}).json()
    except:
        bookings = []

    return render_template('logistics.html', bookings=bookings)

@app.route('/cakes')
def cakes():
    if 'user' not in session:
        return redirect(url_for('login'))

    try:
        orders = api_request('GET', params={'table': 'cake_orders'}).json()
        if not isinstance(orders, list): orders = []
    except:
        orders = []

    return render_template('cakes.html', orders=orders)

@app.route('/services')
def services():
    if 'user' not in session:
        return redirect(url_for('login'))

    try:
        bookings = api_request('GET', params={'table': 'service_bookings'}).json()
        if not isinstance(bookings, list): bookings = []
    except:
        bookings = []

    return render_template('services.html', bookings=bookings)

@app.route('/profile')
def profile():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('profile.html', user=session['user'])

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        try:
            resp = api_request('GET', params={'table': 'users', 'email': email})
            users = resp.json()

            if users and isinstance(users, list) and len(users) > 0:
                user = users[0]
                if bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
                    session['user'] = {
                        'id': user['id'],
                        'email': user['email'],
                        'full_name': user['full_name'],
                        'role': user['role']
                    }
                    return redirect(url_for('index'))
        except Exception as e:
            return render_template('login.html', error=f"Error connecting to API")

        return render_template('login.html', error="Invalid credentials")

    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        full_name = request.form.get('full_name')
        email = request.form.get('email')
        password = request.form.get('password')

        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        data = {
            'full_name': full_name,
            'email': email,
            'password_hash': hashed,
            'role': 'customer',
            'is_active': 1
        }

        try:
            resp = api_request('POST', params={'table': 'users'}, json=data)
            result = resp.json()

            if 'error' in result:
                return render_template('register.html', error=result['error'])

            return redirect(url_for('login'))
        except Exception as e:
            return render_template('register.html', error=f"Error connecting to API")

    return render_template('register.html')

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(port=5001, debug=False)
