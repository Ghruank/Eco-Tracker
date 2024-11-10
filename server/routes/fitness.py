from flask import Flask, request, jsonify
from flask_cors import CORS
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)

# # Not recommended for production! Use environment variables instead
# CLIENT_ID = "CLIENT_ID"
# CLIENT_SECRET = "CLIENT_SECRET"
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
                'https://www.googleapis.com/auth/userinfo.profile',
                  ''  # Add this scope
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
        
        # Simplified body - let's try with just one data source first
        body = {
            "aggregateBy": [{
                "dataTypeName": "com.google.step_count.delta",
                "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
            }],
            "bucketByTime": { "durationMillis": 86400000 },
            "startTimeMillis": int(start.timestamp() * 1000),
            "endTimeMillis": int(end.timestamp() * 1000)
        }
        
        # Get steps data
        response = fitness.users().dataset().aggregate(userId="me", body=body).execute()
        
        # Process steps first
        daily_stats = []
        for bucket in response.get('bucket', []):
            date = datetime.fromtimestamp(int(bucket['startTimeMillis']) / 1000).strftime('%Y-%m-%d')
            steps = 0
            for dataset in bucket['dataset']:
                if dataset['point']:
                    steps = dataset['point'][0]['value'][0]['intVal']
            
            # Now get distance in a separate request
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


if __name__ == '__main__':
    app.run(debug=True, port=5000)