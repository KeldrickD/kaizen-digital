import os
import json
import stripe
import datetime
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore
import gspread
from oauth2client.service_account import ServiceAccountCredentials

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure Stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

# Initialize Firebase (if using Firebase)
try:
    # Try to initialize with credentials from environment
    firebase_creds_json = os.getenv('FIREBASE_CREDENTIALS')
    if firebase_creds_json:
        cred = credentials.Certificate(json.loads(firebase_creds_json))
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        print("Firebase initialized successfully")
        use_firebase = True
    else:
        use_firebase = False
        print("No Firebase credentials found, using Google Sheets instead")
except Exception as e:
    print(f"Error initializing Firebase: {e}")
    use_firebase = False

# Initialize Google Sheets (alternative to Firebase)
try:
    # Use Google Sheets if Firebase credentials are not available
    if not use_firebase:
        scope = [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive'
        ]
        google_creds_json = os.getenv('GOOGLE_CREDENTIALS')
        if google_creds_json:
            creds = ServiceAccountCredentials.from_json_keyfile_dict(
                json.loads(google_creds_json), scope)
            client = gspread.authorize(creds)
            # Open the Google Sheet using its title or URL
            sheet = client.open(os.getenv('GOOGLE_SHEET_NAME', 'Website Payment Tracking')).sheet1
            print("Google Sheets initialized successfully")
            use_sheets = True
        else:
            use_sheets = False
            print("No Google Sheets credentials found")
except Exception as e:
    print(f"Error initializing Google Sheets: {e}")
    use_sheets = False

# Backup to local file storage if neither Firebase nor Sheets is available
if not use_firebase and not use_sheets:
    print("Using local file storage for data")
    data_dir = "data"
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)

# Helper functions for data storage
def store_payment_data(user_id, email, payment_data):
    """Store payment data in the selected backend"""
    try:
        if use_firebase:
            db.collection('payments').document(user_id).set(payment_data)
        elif use_sheets:
            # Prepare data for Google Sheets (flattened structure)
            sheet_data = [
                user_id,
                email if email else "",
                payment_data.get('packageType', ''),
                payment_data.get('packagePrice', 0),
                payment_data.get('paymentStatus', 'none'),
                payment_data.get('depositLink', ''),
                payment_data.get('fullLink', ''),
                datetime.datetime.now().isoformat()
            ]
            # Append to sheet
            sheet.append_row(sheet_data)
        else:
            # Backup to local file
            with open(f"{data_dir}/payments.json", "a") as f:
                f.write(json.dumps({
                    "user_id": user_id,
                    "data": payment_data,
                    "timestamp": datetime.datetime.now().isoformat()
                }) + "\n")
        return True
    except Exception as e:
        print(f"Error storing payment data: {e}")
        return False

def get_payment_status(user_id):
    """Get payment status for a user"""
    try:
        if use_firebase:
            doc = db.collection('payments').document(user_id).get()
            if doc.exists:
                return doc.to_dict().get('paymentStatus', 'none')
            return 'none'
        elif use_sheets:
            # Find user in sheet
            try:
                cell = sheet.find(user_id)
                if cell:
                    row = sheet.row_values(cell.row)
                    # Return payment status (assuming it's in column 5)
                    return row[4] if len(row) > 4 else 'none'
                return 'none'
            except:
                return 'none'
        else:
            # Check local file
            if os.path.exists(f"{data_dir}/payments.json"):
                with open(f"{data_dir}/payments.json", "r") as f:
                    for line in f:
                        data = json.loads(line)
                        if data.get("user_id") == user_id:
                            return data.get("data", {}).get("paymentStatus", "none")
            return 'none'
    except Exception as e:
        print(f"Error getting payment status: {e}")
        return 'none'

def store_interaction(user_id, interaction_type, data):
    """Store user interaction data"""
    try:
        interaction_data = {
            "userId": user_id,
            "type": interaction_type,
            "data": data,
            "timestamp": datetime.datetime.now().isoformat()
        }
        
        if use_firebase:
            db.collection('interactions').add(interaction_data)
        elif use_sheets:
            # Prepare data for Google Sheets
            sheet_data = [
                user_id,
                interaction_type,
                json.dumps(data),
                datetime.datetime.now().isoformat()
            ]
            # Append to interactions sheet or a different tab
            interaction_sheet = client.open(os.getenv('GOOGLE_SHEET_NAME', 'Website Payment Tracking')).worksheet("Interactions")
            interaction_sheet.append_row(sheet_data)
        else:
            # Backup to local file
            with open(f"{data_dir}/interactions.json", "a") as f:
                f.write(json.dumps(interaction_data) + "\n")
        return True
    except Exception as e:
        print(f"Error storing interaction: {e}")
        return False

# Routes
@app.route('/api/payment-options/create', methods=['POST'])
def create_payment_options():
    """Create payment links for deposit and full payment"""
    try:
        data = request.json
        user_id = data.get('userId')
        email = data.get('email')
        package_type = data.get('packageType')
        package_price = int(data.get('packagePrice'))
        deposit_amount = int(data.get('depositAmount', 500))
        
        if not user_id or not package_type or not package_price:
            return jsonify({"error": "Missing required fields"}), 400
        
        # Create metadata for tracking
        metadata = {
            "userId": user_id,
            "packageType": package_type,
            "email": email if email else "not_provided"
        }
        
        # Create Stripe Payment Link for deposit
        deposit_link = stripe.PaymentLink.create(
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': f'Deposit for {package_type}',
                        'description': f'$500 deposit for your {package_type} website package'
                    },
                    'unit_amount': deposit_amount * 100,  # Amount in cents
                },
                'quantity': 1,
            }],
            metadata={
                **metadata,
                "paymentType": "deposit"
            },
            after_completion={
                "type": "redirect",
                "redirect": {
                    "url": f"{request.host_url.rstrip('/')}/api/payment-success?type=deposit&userId={user_id}"
                }
            }
        )
        
        # Create Stripe Payment Link for full payment
        full_link = stripe.PaymentLink.create(
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': f'{package_type} Website Package',
                        'description': f'Full payment for your {package_type} website package'
                    },
                    'unit_amount': package_price * 100,  # Amount in cents
                },
                'quantity': 1,
            }],
            metadata={
                **metadata,
                "paymentType": "full"
            },
            after_completion={
                "type": "redirect",
                "redirect": {
                    "url": f"{request.host_url.rstrip('/')}/api/payment-success?type=full&userId={user_id}"
                }
            }
        )
        
        # Store payment data
        payment_data = {
            "userId": user_id,
            "email": email,
            "packageType": package_type,
            "packagePrice": package_price,
            "depositAmount": deposit_amount,
            "paymentStatus": "none",
            "depositLink": deposit_link.url,
            "fullLink": full_link.url,
            "createdAt": datetime.datetime.now().isoformat()
        }
        
        store_payment_data(user_id, email, payment_data)
        
        return jsonify({
            "links": {
                "deposit": deposit_link.url,
                "full": full_link.url
            }
        })
        
    except Exception as e:
        print(f"Error creating payment links: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/payment-options/status', methods=['GET'])
def check_payment_status():
    """Check payment status for a user"""
    user_id = request.args.get('userId')
    if not user_id:
        return jsonify({"error": "Missing userId parameter"}), 400
    
    status = get_payment_status(user_id)
    return jsonify({"status": status})

@app.route('/api/payment-options/interaction', methods=['POST'])
def record_interaction():
    """Record user interaction"""
    try:
        data = request.json
        user_id = data.get('userId')
        interaction_type = data.get('type')
        interaction_data = data.get('data', {})
        
        if not user_id or not interaction_type:
            return jsonify({"error": "Missing required fields"}), 400
        
        store_interaction(user_id, interaction_type, interaction_data)
        return jsonify({"success": True})
        
    except Exception as e:
        print(f"Error recording interaction: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/payment-success', methods=['GET'])
def payment_success():
    """Handle successful payment and update status"""
    payment_type = request.args.get('type')
    user_id = request.args.get('userId')
    
    if not payment_type or not user_id:
        return "Error: Missing parameters", 400
    
    # Update payment status
    try:
        status = "deposit_paid" if payment_type == "deposit" else "full_paid"
        
        if use_firebase:
            db.collection('payments').document(user_id).update({
                "paymentStatus": status,
                "paymentCompletedAt": datetime.datetime.now().isoformat()
            })
        elif use_sheets:
            # Find and update user in sheet
            cell = sheet.find(user_id)
            if cell:
                sheet.update_cell(cell.row, 5, status)  # Update status column
        else:
            # Update in local file (more complex, would need to rewrite file)
            pass
            
        # Send intake form via email (implementation would depend on email service)
        # This would be implemented here
        
        # Redirect to thank you page
        return f"""
        <html>
            <head>
                <meta http-equiv="refresh" content="5;url=/thank-you" />
                <title>Payment Successful</title>
                <style>
                    body {{ font-family: Arial, sans-serif; text-align: center; padding: 50px; }}
                    .success {{ color: green; }}
                </style>
            </head>
            <body>
                <h1 class="success">Payment Successful!</h1>
                <p>Thank you for your payment. You will receive the intake form via email shortly.</p>
                <p>Redirecting to the thank you page in 5 seconds...</p>
            </body>
        </html>
        """
        
    except Exception as e:
        print(f"Error updating payment status: {e}")
        return f"Error: {str(e)}", 500

# Webhook to handle Stripe events
@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.data
    sig_header = request.headers.get('Stripe-Signature')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.getenv('STRIPE_WEBHOOK_SECRET')
        )
    except ValueError as e:
        return 'Invalid payload', 400
    except stripe.error.SignatureVerificationError as e:
        return 'Invalid signature', 400
    
    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        # Extract metadata
        metadata = session.get('metadata', {})
        user_id = metadata.get('userId')
        payment_type = metadata.get('paymentType')
        
        if user_id and payment_type:
            # Update payment status
            status = "deposit_paid" if payment_type == "deposit" else "full_paid"
            
            if use_firebase:
                db.collection('payments').document(user_id).update({
                    "paymentStatus": status,
                    "paymentCompletedAt": datetime.datetime.now().isoformat(),
                    "stripeSessionId": session.id
                })
            elif use_sheets:
                # Find and update user in sheet
                cell = sheet.find(user_id)
                if cell:
                    sheet.update_cell(cell.row, 5, status)
    
    return jsonify(success=True)

if __name__ == '__main__':
    app.run(debug=True) 