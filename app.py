from flask import Flask, jsonify, request
import requests
import json
from datetime import date, timedelta

app = Flask(__name__)


@app.route('/electricity', methods=['GET'])
def get_electricity_data():
    # Your electricity function code here
    def electricity(trading_date, delivery_date):
        url = 'https://www.epexspot.com/en/market-data?ajax_form=1&_wrapper_format=html&_wrapper_format=drupal_ajax'
        headers = {
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Host': 'www.epexspot.com',
            'Referer': f'https://www.epexspot.com/en/market-data?market_area=AT&trading_date={trading_date}&delivery_date={delivery_date}&underlying_year=&modality=Auction&sub_modality=DayAhead&product=60&data_mode=graph&period=day',
            'ajax_form': '1',
            '_wrapper_format': 'drupal_ajax'
        }

        data = {
            'filters[modality]': 'Auction',
            'filters[sub_modality]': 'DayAhead',
            'filters[trading_date]': trading_date,
            'filters[delivery_date]': delivery_date,
            'filters[product]': '60',
            'filters[data_mode]': 'graph',
            'filters[market_area]': 'FR',
            'filters[period]': 'year',
            'triggered_element': 'filters[data_mode]',
            'first_triggered_date': '',
            'form_build_id': 'form-PtdHvSGPvXq4x0229zJXzzvgM0b6FfyjO2BZWzc6oAY',
            'form_id': 'market_data_filters_form',
            '_triggering_element_name': 'submit_js',
            '_triggering_element_value': '',
            '_drupal_ajax': '1',
            'ajax_page_state[theme]': 'epex',
            'ajax_page_state[theme_token]': '',
            'ajax_page_state[libraries]': 'bootstrap/popover,bootstrap/tooltip,core/html5shiv,core/jquery.form,epex/global-scripts,epex/global-styling,epex_core/data-disclaimer,epex_market_data/auc_status,epex_market_data/filters,epex_market_data/graphs,epex_market_data/map,epex_market_data/tables,eu_cookie_compliance/eu_cookie_compliance_default,statistics/drupal.statistics,system/base'
        }

        response = requests.post(url, headers=headers, data=data)
        energy_data = json.loads(json.loads(response.text)[
                                 0]['settings']['charts']['price'])

        peakload_actuel = energy_data[2]['data']
        baseload_actuel = energy_data[1]['data']
        baseload_elec = []
        peakload_elec = []
        dates_elec = []

        last_elec_price_base = json.dumps(peakload_actuel[-1]['y'])
        last_elec_price_peak = json.dumps(baseload_actuel[-1]['y'])
        last_elec_date_peak = json.dumps(dates_elec[-1]) if dates_elec else ''

        for base in range(len(baseload_actuel)):
            baseload_elec.append(energy_data[1]['data'][base]['y'])
            peakload_elec.append(energy_data[2]['data'][base]['y'])
            power_date = str(energy_data[2]['data'][base]['x'])
            power_date = power_date[:10]
            power_date = "'" + \
                date.fromtimestamp(int(power_date)).strftime('%c') + "'"
            real_date = power_date[0:16]
            dates_elec.append(real_date)

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
    trading_date = request.args.get(
        'trading_date', date.today().strftime("%Y-%m-%d"))
    delivery_date = request.args.get(
        'delivery_date', (date.today() + timedelta(days=1)).strftime("%Y-%m-%d"))

    data = electricity(trading_date, delivery_date)
    return jsonify(data)


if __name__ == '__main__':
    app.run(port=8000)
