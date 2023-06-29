import time
import random
import mysql.connector
import datetime
import requests
hoster="127.0.0.1"
date = datetime.datetime.now().isoformat()[:10]
thisYear = int(datetime.datetime.now().isoformat()[2:4])
Elecurl = f"http://{hoster}:3333/electricite-base-data"
Gazurl = f"http://{hoster}:3333/api/v1/gaz/futur/start/2022-01-01/end/{date}/Days/First/{thisYear + 1}"
Coalurl = f"http://{hoster}:3333/api/v1/e-market/charbon/period/3"
Co2url = f"http://{hoster}:3333/api/v1/e-market/co2/period/3"
Fuelurl = f"http://{hoster}:3333/api/v1/e-market/petrole/period/3"

# Connexion à la base de données MySQL
conn = mysql.connector.connect(
    host='localhost',
    user='root',
    password='root',
    database='emarket_main_db'
)
cursor = conn.cursor()

# Recuperation des données de l'éléctrcité
Elecresponse = requests.get(Elecurl)
Elecdata = Elecresponse.json()


# Recuperation des données Gaz
Gazresponse = requests.get(Gazurl)
Gazdata = Gazresponse.json()
Gazdata = Gazdata['results']['items']
Gazdates = []
Gazprices = []

for item in Gazdata:
    Gazdates.append(item['tradedatetimegmt'])
    Gazprices.append(item['close'])

# Recuperation des données Charbon
Coalresponse = requests.get(Coalurl)
Coaldata = Coalresponse.json()['bars']

Coaldates = []
Coalprices = []

for item in Coaldata:
    Coaldates.append(item[0])
    Coalprices.append(item[1])

# Recuperation des données Co2
Co2response = requests.get(Co2url)
Co2data = Co2response.json()['bars']


Co2dates = []
Co2prices = []

for item in Co2data:
    Co2dates.append(item[0])
    Co2prices.append(item[1])

# Recuperation des données Pétrole
Fuelresponse = requests.get(Fuelurl)
Fueldata = Fuelresponse.json()['bars']


Fueldates = []
Fuelprices = []


for item in Fueldata:
    Fueldates.append(item[0])
    Fuelprices.append(item[1])


# Boucle d'injection de données toutes les 24 heures
while True:
    # Générer une nouvelle valeur aléatoire
    prix = random.randint(1, 100)
    prix_base_elec = Elecdata['lastBaseload']
    prix_peak_elec = Elecdata['lastPeakload']
    prix_min_base_elec = min(Elecdata['BaseloadFiltred'])
    prix_avg_base_elec = round(
        sum(Elecdata['BaseloadFiltred']) / len(Elecdata['BaseloadFiltred']))
    prix_max_base_elec = max(Elecdata['BaseloadFiltred'])
    prix_min_peak_elec = min(Elecdata['PeakloadFiltred'])
    prix_avg_peak_elec = round(
        sum(Elecdata['PeakloadFiltred']) / len(Elecdata['PeakloadFiltred']))
    prix_max_peak_elec = max(Elecdata['PeakloadFiltred'])
    date_enregistrement = datetime.datetime.now()

    # print(prix_base_elec, prix_peak_elec, prix_min_base_elec, prix_avg_base_elec, prix_max_base_elec,prix_min_peak_elec, prix_avg_peak_elec, prix_max_peak_elec, date_enregistrement)

    # Insérer la nouvelle données dans la base de données de l'éléctrcité
    cursor.execute("INSERT INTO electrecities (prix_base, prix_peak, prix_min_base , prix_avg_base , prix_max_base ,prix_min_peak , prix_avg_peak , prix_max_peak , date_enregistrement) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)",
                   (prix_base_elec, prix_peak_elec, prix_min_base_elec, prix_avg_base_elec, prix_max_base_elec, prix_min_peak_elec, prix_avg_peak_elec, prix_max_peak_elec, date_enregistrement))
    conn.commit()
    print('✅ Données d\'éléctrcité injectées avec succès !')

    # prix_base_gaz = Gazprices[-1]
    # prix_min_base_gaz = min(Gazprices)
    # prix_avg_base_gaz = round(sum(Gazprices) / len(Gazprices))
    # prix_max_base_gaz = max(Gazprices)

    # # Insérer la nouvelle données dans la base de données de gaz
    # cursor.execute("INSERT INTO gazs (prix_base , prix_min_base , prix_avg_base ,prix_max_base  ,date_enregistrement) VALUES (%s,%s,%s,%s,%s)",
    #                (prix_base_gaz, prix_min_base_gaz, prix_avg_base_gaz, prix_max_base_gaz, date_enregistrement))
    # conn.commit()
    print('✅ Données de gaz injectées avec succès !')

    prix_base_coal = Coalprices[-1]

    # Insérer la nouvelle données dans la base de données de Charbon
    cursor.execute("INSERT INTO coals (prix ,date_enregistrement) VALUES (%s,%s )",
                   (prix_base_coal, date_enregistrement))
    conn.commit()
    print('✅ Données de charbon injectées avec succès !')

    prix_base_co2 = Co2prices[-1]

    # Insérer la nouvelle données dans la base de données de CO²
    cursor.execute("INSERT INTO co2s (prix ,date_enregistrement) VALUES (%s,%s )",
                   (prix_base_co2, date_enregistrement))
    conn.commit()
    print('✅ Données de CO² injectées avec succès !')

    prix_base_fuel = Fuelprices[-1]

    # Insérer la nouvelle données dans la base de données de CO²
    cursor.execute("INSERT INTO fuels (prix ,date_enregistrement) VALUES (%s,%s )",
                   (prix_base_fuel, date_enregistrement))
    conn.commit()
    print('✅ Données de gaz pétroles avec succès !')

    # Attendre 24 heures
    time.sleep(24 * 60 * 60)  # 24 heures = 24 * 60 * 60 secondes

# Fermer la connexion à la base de données
conn.close()
