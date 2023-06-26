import time
import datetime
import requests
from datetime import date, timedelta

# trading_date = request.args.get('trading_date', date.today().strftime("%Y-%m-%d"))
# delivery_date = request.args.get('delivery_date', (date.today() + timedelta(days=1)).strftime("%Y-%m-%d"))

print((date.today() + timedelta(days=1)).strftime("%Y-%m-%d"))
