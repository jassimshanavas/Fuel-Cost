from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    try:
        # Get user inputs
        petrol_price = float(request.json['petrol_price'])
        mileage_min = float(request.json['mileage_min'])
        mileage_max = float(request.json['mileage_max'])
        distances = list(map(float, request.json['distances'].split(',')))
        base_kms = float(request.json['base_kms'])
        extra_rate = float(request.json['extra_rate'])

        # Calculations
        total_kms = sum(distances)
        extra_kms = max(total_kms - base_kms, 0)
        extra_amount = extra_kms * extra_rate

        max_litres = total_kms / mileage_min
        min_litres = total_kms / mileage_max

        max_total_price = max_litres * petrol_price
        min_total_price = min_litres * petrol_price

        return jsonify({
            "total_kms": round(total_kms, 2),
            "extra_kms": round(extra_kms, 2),
            "extra_amount": round(extra_amount, 2),
            "max_litres": round(max_litres, 2),
            "min_litres": round(min_litres, 2),
            "max_total_price": round(max_total_price, 2),
            "min_total_price": round(min_total_price, 2)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)