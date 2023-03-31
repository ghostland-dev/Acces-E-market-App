import { Router } from '@adonisjs/core/build/standalone';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios, { AxiosResponse } from 'axios';
import moment from 'moment';

let calendarElec = (year = actualYear, type = "B") => {
  return `"/E.F7${type}YF${year}"`
}

const date = new Date()
const now = new Date()
const year = now.getFullYear()
const month = String(now.getMonth() + 1).padStart(2, '0')
const day = String(now.getDate()).padStart(2, '0')
const actualYear = (date.getFullYear()).toString().slice(2)


export default class DashboardController {
  public async dashboard({ view, params }: HttpContextContract) {
    let noData = 'En attente des données'
    const { id } = params;
    let petrole, charbon, co2, electrcite, electcityData, gaz, drivers, gazData

    if (id != null) {

      petrole = await axios.get('http://127.0.0.1:3333/api/v1/e-market/petrole/period/' + id + "");
      charbon = await axios.get('http://127.0.0.1:3333/api/v1/e-market/charbon/period/' + id + "");
      co2 = await axios.get('http://127.0.0.1:3333/api/v1/e-market/co2/period/' + id + "");
    } else {
      petrole = await axios.get('http://127.0.0.1:3333/api/v1/e-market/petrole/period/1');
      charbon = await axios.get('http://127.0.0.1:3333/api/v1/e-market/charbon/period/1');
      co2 = await axios.get('http://127.0.0.1:3333/api/v1/e-market/co2/period/1');
    }

    //FIXME: 
    electrcite = await axios.get(`http://127.0.0.1:3333/api/v1/elec/futur/debut/2022-02-01/fin/2023-03-31/Days/First/24/P`)
    gaz = await axios.get('http://127.0.0.1:3333/api/v1/gaz/futur/start/2022-01-01/end/2023-02-01/Days/First/24');
    

    // TODO::Finir d'envoyer les données vers le front 
    electcityData = electrcite.data.results.items
    gazData = gaz.data.results.items
    drivers = {
      charbon: {
        percentChangeDirection: charbon.data.percentChangeDirection,
        marketId: charbon.data.marketId,
        stripDescription: petrole.data.stripDescription == null ? noData : petrole.data.stripDescription,
        lastPrice: charbon.data.lastPrice == null ? noData : charbon.data.lastPrice + ' €/kw'
      },
      petrole: {
        percentChangeDirection: petrole.data.percentChangeDirection,
        marketId: petrole.data.marketId,
        stripDescription: petrole.data.stripDescription == null ? noData : petrole.data.stripDescription,
        lastPrice: petrole.data.lastPrice == null ? noData : petrole.data.lastPrice + ' €/kw'
      },
      co2: {
        percentChangeDirection: co2.data.percentChangeDirection,
        marketId: co2.data.marketId,
        stripDescription: petrole.data.stripDescription == null ? noData : petrole.data.stripDescription,
        lastPrice: co2.data.lastPrice == null ? noData : co2.data.lastPrice + ' €/kw'
      }
    }





    // console.log(response.data)

    // let datas = response.data;
    // let main = [];
    // let prix = [];
    // let lastPrice = response.data.settlementPrice
    // let change = response.data.settlementPrice
    // if (datas.bars) {
    //   main = datas.bars.map((bar) => (moment(bar[0], 'ddd MMM DD HH:mm:ss YYYY').format('YYYY-MM-DD')));
    //   prix = datas.bars.map((bar: any[]) => bar[1]);
    // }


    return view.render('dashboard', { drivers, electcityData, gazData });

  }

  public async create({ }: HttpContextContract) { }

  public async store({ }: HttpContextContract) { }

  public async show({ }: HttpContextContract) { }

  public async edit({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}
