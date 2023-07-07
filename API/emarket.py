from flask import Flask, jsonify, request
from flask_restful import Api, Resource
from flask_jwt_extended import JWTManager, jwt_required
from flasgger import Swagger

import requests
import json
from datetime import date, timedelta

app = Flask(__name__)
api = Api(app)
swagger = Swagger(app)

app.config['JWT_SECRET_KEY'] = 'your-secret-key'
jwt = JWTManager(app)

class ElectricityData(Resource):
    @jwt_required()
    class SwaggerTagsMixin:
        @classmethod
        def decorator(cls, f):
            f._swagger_tags = ['Electricity']
            return f

@ElectricityData.SwaggerTagsMixin.decorator
@swagger.parameter('trading_date', 'query', str, False, 'Trading date in the format YYYY-MM-DD')
@swagger.parameter('delivery_date', 'query', str, False, 'Delivery date in the format YYYY-MM-DD')
@swagger.response(200, 'Success')
def get(self):
        def electricity(trading_date, delivery_date):
            url = 'https://www.epexspot.com/backend/approxy/getmarkets/csv?'

            params = {
                'country': 'FR',
                'trading_date': trading_date,
                'delivery_date': delivery_date,
                'product': '60',
                'currency': 'EUR',
                'csvType': 'Auction',
                'regiontraded': '10XFR',
                'market_area': 'FR',
                'sub_trading_date': '',
                'sub_delivery_date': '',
                'modal': '',
                'sub_modality': '',
                'product_type': '60'
            }

            response = requests.get(url, params=params)
            energy_data = response.json()

            baseload_elec = []
            peakload_elec = []
            dates_elec = []

            last_elec_price_base = energy_data[-1]['Baseload']
            last_elec_price_peak = energy_data[-1]['Peakload']
            last_elec_date_peak = energy_data[-1]['End Date'] if energy_data else ''

            for data in energy_data:
                baseload_elec.append(data['Baseload'])
                peakload_elec.append(data['Peakload'])
                dates_elec.append(data['End Date'])

            baseload = baseload_elec
            peakload = peakload_elec
            cloture_date = dates_elec

            return {
                'lastClosureDate': last_elec_date_peak,
                'lastBaseload': last_elec_price_base,
                'lastPeakload': last_elec_price_peak,
                'BaseloadFiltred': baseload,
                'PeakloadFiltred': peakload,
                'HorodatageFiltred': cloture_date
            }

        # Get query parameters or use default values
        trading_date = request.args.get('trading_date', date.today().strftime("%Y-%m-%d"))
        delivery_date = request.args.get('delivery_date', (date.today() + timedelta(days=1)).strftime("%Y-%m-%d"))

        data = electricity(trading_date, delivery_date)
        return jsonify(data)

api.add_resource(ElectricityData, '/electricity')

if __name__ == '__main__':
    app.run(port=8000)
