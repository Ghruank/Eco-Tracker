from flask import Flask
import pymongo
from routes.auth_routes import auth_bp  # Import the auth routes
from flask_cors import CORS

app = Flask(__name__)
# app.secret_key='vjti@123'
CORS(app)
# mongodb+srv://sohammargaj55555:JZfqRgeiC6QLNJQm@cluster0.u4jci.mongodb.net/
# MongoDB connection
client = pymongo.MongoClient("mongodb+srv://sohammargaj55555:JZfqRgeiC6QLNJQm@cluster0.u4jci.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["Eco-Tracker"]
collections_user = db["user"]

# for auth routes go to routes folder and auth_routes.py
#route :  localhost:5000/auth/...
app.register_blueprint(auth_bp)

# os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

# GOOGLE_CLIENT_ID = "33674737284-srfbp7srvi8ie2m0sr426fved0hjq2tp.apps.googleusercontent.com"
# client_secrets_file = os.path.join(pathlib.Path(__file__).parent, "client_secret.json")

# flow = Flow.from_client_secrets_file(
#     client_secrets_file=client_secrets_file,
#     scopes=["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"],
#     redirect_uri="http://127.0.0.1:5000/callback"
# )


# def login_is_required(function):
#     def wrapper(*args, **kwargs):
#         if "google_id" not in session:
#             return abort(401)  # Authorization required
#         else:
#             return function()

#     return wrapper

@app.route('/')
def home():
    return "Hello World"


if __name__ == '__main__':
    app.run(debug=True)