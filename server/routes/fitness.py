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
        scopes=['https://www.googleapis.com/auth/fitness.activity.read'],
        redirect_uri=CLIENT_CONFIG['web']['redirect_uris'][0]
    )
    auth_url, _ = flow.authorization_url(access_type='offline')
    return jsonify({'url': auth_url})

@app.route('/callback')
def callback():
    code = request.args.get('code')
    flow = Flow.from_client_config(
        CLIENT_CONFIG,
        scopes=['https://www.googleapis.com/auth/fitness.activity.read'],
        redirect_uri=CLIENT_CONFIG['web']['redirect_uris'][0]
    )
    flow.fetch_token(code=code)
    return jsonify({'token': flow.credentials.token})

@app.route('/steps')
def get_steps():
    print("entering steps")
    token = request.headers.get('Authorization').split(' ')[1]
    credentials = Credentials(token=token)
    
    fitness = build('fitness', 'v1', credentials=credentials)
    
    end = datetime.now(timezone.utc)
    start = end - timedelta(days=1)
    print("sup")
    body = {
        "aggregateBy": [{
            "dataTypeName": "com.google.step_count.delta",
            "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
        }],
        "bucketByTime": { "durationMillis": 86400000 },
        "startTimeMillis": int(start.timestamp() * 1000),
        "endTimeMillis": int(end.timestamp() * 1000)
    }

    # Get data sources to identify the correct data source ID for steps
    data_sources = fitness.users().dataSources().list(userId="me").execute()

# Print available data sources for debugging
    for source in data_sources.get('dataSource', []):
        print("Data Source ID:", source['dataStreamId'])
        print("Data Type:", source['dataType']['name'])

    
    response = fitness.users().dataset().aggregate(userId="me", body=body).execute()
    
    daily_steps = []
    for bucket in response.get('bucket', []):
        date = datetime.fromtimestamp(int(bucket['startTimeMillis']) / 1000).strftime('%Y-%m-%d')
        steps = 0
        if bucket['dataset'][0]['point']:
            steps = bucket['dataset'][0]['point'][0]['value'][0]['intVal']
        daily_steps.append({'date': date, 'steps': steps})
    print("hi")
    print(daily_steps)
    return jsonify(daily_steps)

if __name__ == '__main__':
    app.run(debug=True, port=5000)