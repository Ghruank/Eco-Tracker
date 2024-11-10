from flask import Flask, request, jsonify
from flask_cors import CORS
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
import os
import pymongo
from auth_routes import auth_bp
from meta_ai_api import MetaAI
import google.generativeai as genai
from PIL import Image

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])
client = pymongo.MongoClient("mongodb+srv://sohammargaj55555:JZfqRgeiC6QLNJQm@cluster0.u4jci.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["Eco-Tracker"]
collections_user = db["user"]

app.register_blueprint(auth_bp)
load_dotenv()

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
CLIENT_CONFIG = {
    "web": {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "redirect_uris": ["http://localhost:3000/callback"]
    }
}

@app.route('/login')
def login():
    flow = Flow.from_client_config(
        CLIENT_CONFIG,
        scopes=['https://www.googleapis.com/auth/fitness.activity.read',
                'https://www.googleapis.com/auth/fitness.location.read',
                'https://www.googleapis.com/auth/userinfo.profile'
                ],
        redirect_uri=CLIENT_CONFIG['web']['redirect_uris'][0]
    )
    auth_url, _ = flow.authorization_url(access_type='offline')
    return jsonify({'url': auth_url})

@app.route('/callback')
def callback():
    code = request.args.get('code')
    flow = Flow.from_client_config(
        CLIENT_CONFIG,
        scopes=['https://www.googleapis.com/auth/fitness.activity.read',
                'https://www.googleapis.com/auth/fitness.location.read',
                'https://www.googleapis.com/auth/userinfo.profile'  # Add this scope
                ],
        redirect_uri=CLIENT_CONFIG['web']['redirect_uris'][0]
    )
    flow.fetch_token(code=code)
    service = build('oauth2', 'v2', credentials=flow.credentials)
    user_info = service.userinfo().get().execute()
    email = user_info.get('name')
    
    if collections_user.find_one({'username' : user_info.get('name') }):
        pass
    else:
        collections_user.insert_one({'username': user_info.get('name'), 'password': user_info.get('picture') , 'email': user_info.get('name')})
    
    return jsonify({'token': flow.credentials.token, 'name': user_info.get('name'),
        'picture': user_info.get('picture')})

@app.route('/steps')
def get_steps():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        credentials = Credentials(token=token)
        
        fitness = build('fitness', 'v1', credentials=credentials)
        
        end = datetime.now(timezone.utc)
        start = end - timedelta(days=7)

        body = {
            "aggregateBy": [{
                "dataTypeName": "com.google.step_count.delta",
                "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
            }],
            "bucketByTime": { "durationMillis": 86400000 },
            "startTimeMillis": int(start.timestamp() * 1000),
            "endTimeMillis": int(end.timestamp() * 1000)
        }
        
        response = fitness.users().dataset().aggregate(userId="me", body=body).execute()
        daily_stats = []
        for bucket in response.get('bucket', []):
            date = datetime.fromtimestamp(int(bucket['startTimeMillis']) / 1000).strftime('%Y-%m-%d')
            steps = 0
            for dataset in bucket['dataset']:
                if dataset['point']:
                    steps = dataset['point'][0]['value'][0]['intVal']
            
            distance_body = {
                "aggregateBy": [{
                    "dataTypeName": "com.google.distance.delta",
                    "dataSourceId": "derived:com.google.distance.delta:com.google.android.gms:merge_distance_delta"
                }],
                "bucketByTime": { "durationMillis": 86400000 },
                "startTimeMillis": bucket['startTimeMillis'],
                "endTimeMillis": bucket['endTimeMillis']
            }
            
            try:
                distance_response = fitness.users().dataset().aggregate(userId="me", body=distance_body).execute()
                distance = 0
                if distance_response.get('bucket'):
                    for dataset in distance_response['bucket'][0]['dataset']:
                        if dataset['point']:
                            distance += round(dataset['point'][0]['value'][0]['fpVal'], 2)
            except Exception as e:
                print(f"Error fetching distance: {e}")
                distance = 0
            activity_body = {
                "aggregateBy": [{
                    "dataTypeName": "com.google.activity.segment",
                    "dataSourceId": "derived:com.google.activity.segment:com.google.android.gms:merge_activity_segments"
                }],
                "bucketByTime": { "durationMillis": 86400000 },
                "startTimeMillis": bucket['startTimeMillis'],
                "endTimeMillis": bucket['endTimeMillis']
            }
        
            try:
                activity_response = fitness.users().dataset().aggregate(userId="me", body=activity_body).execute()
                activities = []
                if activity_response.get('bucket'):
                    for dataset in activity_response['bucket'][0]['dataset']:
                        for point in dataset.get('point', []):
                            if point.get('value'):
                                activity_type = point['value'][0]['intVal']
                                duration_ms = point['value'][1]['intVal']
                                activities.append({
                                    'type': activity_type,
                                    'duration_minutes': round(duration_ms / 60000, 1)  # Convert ms to minutes
                                })
            except Exception as e:
                print(f"Error fetching activities: {e}")
                activities = []
            
            daily_stats.append({
                'date': date,
                'steps': steps,
                'distance': distance,
                'activities': activities
            })
        
        return jsonify(daily_stats)
    
    except Exception as e:
        print(f"Error in get_steps: {e}")
        return jsonify({'error': str(e)}), 500

ai = MetaAI()

@app.route('/ai', methods=['POST'])
def get_eco_suggestions():
    try:
        print("hi")  
        data = request.json
        steps_data = data.get('stepsData', {})
        weekly_avg = data.get('weeklyAverage', {})
    
        message = (
            f"As an eco-conscious AI assistant, analyze this user's activity data and provide feedback. "
            f"The user walks {weekly_avg.get('avgSteps', 0)} steps on average per day, "
            f"covering {weekly_avg.get('avgDistance', 0)} km. "
            f"Today they walked {steps_data.get('todaySteps', 0)} steps. "
            f"Without any intro or additional formatting, give me 3 specific, actionable, and encouraging suggestions "
            f"about how they can improve their eco-friendly behavior based on their walking patterns. "
            f"Focus on reducing carbon footprint. Keep it conversational and positive. "
            f"Include one specific statistic about environmental impact. "
            f"No introductions or conclusions, just the direct suggestions in a paragraph format."
        )
        print(message)

        # Get response from Meta AI
        response = ai.prompt(message=message)
        suggestions = response.get("message", "Unable to generate suggestions at this time.")
        
        print("AI Suggestions:", suggestions)
        return ({"message": suggestions})

    except Exception as e:
        print(f"Error getting eco suggestions: {str(e)}")
        return jsonify({
            'error': 'Failed to get eco suggestions'
        }), 500

@app.route('/ocr/power', methods=['POST'])
def power():

    ai = MetaAI()
    appliances=request.form.get('appliances')
    residents=request.form.get('residents')
    usesEV=request.form.get('usesEV')
    uid = request.form.get('userID')

    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    image = Image.open(request.files['image'])
    genai.configure(api_key="AIzaSyD7bXAE5lZ_ny6a3LxJ51Xnn2VNVFY9ZgA")
    # myfile = genai.upload_file(image)
    # print(f"{myfile=}")

    model = genai.GenerativeModel("gemini-1.5-flash")
    result = model.generate_content([image, "\n\n", "give me the amount of electricity consumed in kWh rounded upto second decimal value and month of the consumption, by reading the given photo \n this amount should be in json form in the format {'energy'='amount of energy', 'month,='only month of consumption'}"])


    # Process the image as needed for disease detection
    # For example, pass it to a pre-trained ML model for prediction
  # Replace with actual model inference
    if collections_user.find_one({'username' : uid }):
        data = {'appliances': appliances, 'residents': residents, 'usesEV': usesEV, "result":result.text}
        collections_user.update_one(
            {'username': uid},
            {'$push': {'statistics': {'appliances': appliances, 'residents': residents, 'usesEV': usesEV, "result": result.text}}}
        )

    

    return ({'appliances': appliances, 'residents': residents, 'usesEV': usesEV, "result":result.text})



if __name__ == '__main__':
    app.run(debug=True)

