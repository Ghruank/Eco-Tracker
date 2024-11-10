import google.generativeai as genai

genai.configure(api_key="AIzaSyD7bXAE5lZ_ny6a3LxJ51Xnn2VNVFY9ZgA")

myfile = genai.upload_file(".\WhatsApp Image 2024-11-09 at 18.39.35_1bce1924.jpg")
print(f"{myfile=}")

model = genai.GenerativeModel("gemini-1.5-flash")
result = model.generate_content(
    [myfile, "\n\n", "give me the amount of electricity consumed in kWh, rounded upto second decimal value by reading the given photo \n this amount should be in json form in the format {'energy'='amount of energy'}"]
)
print(f"{result.text=}")