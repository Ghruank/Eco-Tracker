from flask import Flask, request, jsonify
import pymongo
from routes.auth_routes import auth_bp  # Import the auth routes
from flask_cors import CORS
import google.generativeai as genai
from PIL import Image


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

@app.route('/ocr/power', methods=['POST'])
def power():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    image = Image.open(request.files['image'])
    genai.configure(api_key="AIzaSyD7bXAE5lZ_ny6a3LxJ51Xnn2VNVFY9ZgA")
    # myfile = genai.upload_file(image)
    # print(f"{myfile=}")

    model = genai.GenerativeModel("gemini-1.5-flash")
    result = model.generate_content([image, "\n\n", "give me the amount of electricity consumed in kWh, rounded upto second decimal value by reading the given photo \n this amount should be in json form in the format {'energy'='amount of energy'}"])
    print(f"{result.text=}")
    # Process the image as needed for disease detection
    # For example, pass it to a pre-trained ML model for prediction
    prediction = "Example Disease Prediction"  # Replace with actual model inference

    return jsonify({"prediction": prediction})


if __name__ == '__main__':
    app.run(debug=True)