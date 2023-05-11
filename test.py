
from flask import Flask, jsonify
import http.client
import mimetypes
from codecs import encode
import json
from datetime import date, datetime, timedelta

from flask import jsonify

# Main variables
actualtoday = datetime.now().strftime("%d %b. %Y")

# Get today's date
day = date.today()

# Calculate tomorrow's date
delta = timedelta(days=1)
tomorrow = day + delta
tomorrow = tomorrow.strftime('%d %b. %Y')


app = Flask(__name__)


@app.route('/example')
def example():

    conn = http.client.HTTPSConnection("www.epexspot.com")
    dataList = []
    boundary = 'wL36Yn8afVp8Ag7AmP8qZ0SA4n1v9T'
    dataList.append(encode('--' + boundary))
    dataList.append(
        encode('Content-Disposition: form-data; name=filters[modality];'))

    dataList.append(encode('Content-Type: {}'.format('text/plain')))
    dataList.append(encode(''))

    dataList.append(encode("Auction"))
    dataList.append(encode('--' + boundary))
    dataList.append(
        encode('Content-Disposition: form-data; name=filters[sub_modality];'))

    dataList.append(encode('Content-Type: {}'.format('text/plain')))
    dataList.append(encode(''))

    dataList.append(encode("DayAhead"))
    dataList.append(encode('--' + boundary))
    dataList.append(
        encode('Content-Disposition: form-data; name=filters[trading_date];'))

    dataList.append(encode('Content-Type: {}'.format('text/plain')))
    dataList.append(encode(''))

    dataList.append(encode(f"{actualtoday}"))
    dataList.append(encode('--' + boundary))
    dataList.append(
        encode('Content-Disposition: form-data; name=filters[delivery_date];'))

    dataList.append(encode('Content-Type: {}'.format('text/plain')))
    dataList.append(encode(''))

    dataList.append(encode(f"{tomorrow}"))
    dataList.append(encode('--' + boundary))
    dataList.append(
        encode('Content-Disposition: form-data; name=filters[product];'))

    dataList.append(encode('Content-Type: {}'.format('text/plain')))
    dataList.append(encode(''))

    dataList.append(encode("60"))
    dataList.append(encode('--' + boundary))
    dataList.append(
        encode('Content-Disposition: form-data; name=filters[data_mode];'))

    dataList.append(encode('Content-Type: {}'.format('text/plain')))
    dataList.append(encode(''))

    dataList.append(encode("graph"))
    dataList.append(encode('--' + boundary))
    dataList.append(
        encode('Content-Disposition: form-data; name=filters[market_area];'))

    dataList.append(encode('Content-Type: {}'.format('text/plain')))
    dataList.append(encode(''))

    dataList.append(encode("FR"))
    dataList.append(encode('--' + boundary))
    dataList.append(
        encode('Content-Disposition: form-data; name=filters[period];'))

    dataList.append(encode('Content-Type: {}'.format('text/plain')))
    dataList.append(encode(''))

    dataList.append(encode("year"))
    dataList.append(encode('--' + boundary))
    dataList.append(
        encode('Content-Disposition: form-data; name=triggered_element;'))

    dataList.append(encode('Content-Type: {}'.format('text/plain')))
    dataList.append(encode(''))

    dataList.append(encode("filters[data_mode]"))
    dataList.append(encode('--' + boundary))
    dataList.append(
        encode('Content-Disposition: form-data; name=first_triggered_date;'))

    dataList.append(encode('Content-Type: {}'.format('text/plain')))
    dataList.append(encode(''))

    dataList.append(encode(""))
    dataList.append(encode('--' + boundary))
    dataList.append(
        encode('Content-Disposition: form-data; name=form_build_id;'))

    dataList.append(encode('Content-Type: {}'.format('text/plain')))
    dataList.append(encode(''))

    dataList.append(encode("form-CQF0TGe9qNeA7s5RmVwwL95DMqqNCgkEVht9nZvyNvA"))
    dataList.append(encode('--' + boundary))
    dataList.append(encode('Content-Disposition: form-data; name=form_id;'))

    dataList.append(encode('Content-Type: {}'.format('text/plain')))
    dataList.append(encode(''))

    dataList.append(encode("market_data_filters_form"))
    dataList.append(encode('--' + boundary))
    dataList.append(
        encode('Content-Disposition: form-data; name=_triggering_element_name;'))

    dataList.append(encode('Content-Type: {}'.format('text/plain')))
    dataList.append(encode(''))

    dataList.append(encode("submit_js"))
    dataList.append(encode('--' + boundary))
    dataList.append(
        encode('Content-Disposition: form-data; name=_triggering_element_value;'))

    dataList.append(encode('Content-Type: {}'.format('text/plain')))
    dataList.append(encode(''))

    dataList.append(encode(""))
    dataList.append(encode('--' + boundary))
    dataList.append(
        encode('Content-Disposition: form-data; name=_drupal_ajax;'))

    dataList.append(encode('Content-Type: {}'.format('text/plain')))
    dataList.append(encode(''))

    dataList.append(encode("1"))
    dataList.append(encode('--' + boundary))
    dataList.append(
        encode('Content-Disposition: form-data; name=ajax_page_state[theme];'))

    dataList.append(encode('Content-Type: {}'.format('text/plain')))
    dataList.append(encode(''))

    dataList.append(encode("epex"))
    dataList.append(encode('--' + boundary))
    dataList.append(
        encode('Content-Disposition: form-data; name=ajax_page_state[theme_token];'))

    dataList.append(encode('Content-Type: {}'.format('text/plain')))
    dataList.append(encode(''))

    dataList.append(encode(""))
    dataList.append(encode('--' + boundary))
    dataList.append(
        encode('Content-Disposition: form-data; name=ajax_page_state[libraries];'))

    dataList.append(encode('Content-Type: {}'.format('text/plain')))
    dataList.append(encode(''))

    dataList.append(encode("bootstrap/popover,bootstrap/tooltip,core/html5shiv,core/jquery.form,epex/global-scripts,epex/global-styling,epex_core/data-disclaimer,epex_market_data/auc_status,epex_market_data/filters,epex_market_data/graphs,epex_market_data/map,eu_cookie_compliance/eu_cookie_compliance_default,statistics/drupal.statistics,system/base"))
    dataList.append(encode('--'+boundary+'--'))
    dataList.append(encode(''))
    body = b'\r\n'.join(dataList)
    payload = body
    headers = {

        'Host': 'www.epexspot.com',
        'Origin': 'https://www.epexspot.com',
        'Referer': f'https://www.epexspot.com/en/market-data?market_area=AT&trading_date={actualtoday}&delivery_date={tomorrow}&underlying_year=&modality=Auction&sub_modality=DayAhead&technology=&product=60&data_mode=graph&period=&production_period=',
        'Content-type': 'multipart/form-data; boundary={}'.format(boundary)
    }
    conn.request(
        "POST", "/en/market-data?ajax_form=1&_wrapper_format=html&_wrapper_format=drupal_ajax", payload, headers)
    res = conn.getresponse()
    data = jsonify((res.read()).decode("utf-8"))

    return data


if __name__ == '__main__':
    app.run()
