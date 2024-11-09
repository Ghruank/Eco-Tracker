from flask import Flask
import pymongo
from routes.auth_routes import auth_bp  # Import the auth routes
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
client = pymongo.MongoClient("mongodb+srv://sohammargaj55555:JZfqRgeiC6QLNJQm@cluster0.u4jci.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["Eco-Tracker"]
collections_user = db["user"]

# for auth routes go to routes folder and auth_routes.py
#route :  localhost:5000/auth/...
app.register_blueprint(auth_bp)

@app.route('/')
def home():
    return "Hello World"


if __name__ == '__main__':
    app.run(debug=True)