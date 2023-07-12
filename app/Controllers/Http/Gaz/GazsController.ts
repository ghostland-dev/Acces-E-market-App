import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios'
import Event from '@ioc:Adonis/Core/Event'
const date = new Date()
const today = new Date().toISOString().slice(0, 10)
const dateShort = new Date().toISOString().slice(0, 10)
const thisYear = parseInt(new Date().toISOString().slice(2, 4))
const actualYear = date.getFullYear().toString().slice(2)
let calendar = (year = actualYear) => {
  return year
}


export default class GazsController {
  public async gazDetails({ view }: HttpContextContract) {

    try {
      // const url = request.protocol() + '://' + request.host()
      const url = 'http://127.0.0.1:3333'
      function calculateAverage(numbers: any[]) {
        const sum = numbers.reduce((a, b) => a + b, 0)
        const avg = Math.round(sum / numbers.length)
        return avg
      }

      Event.emit('new:user', { id: 1 })
      const cal1Base = await axios.get(
        `${url}/api/v1/gaz/futur/start/2023-02-22/end/2023-04-10/Days/First/24`
      )
      const cal2Base = await axios.get(
        `${url}/api/v1/gaz/futur/start/2023-02-22/end/2023-04-10/Days/First/25`
      )
      const gaz = await axios.get(
        url +
        `/api/v1/gaz/futur/start/2022-01-01/end/${encodeURIComponent(dateShort)}/Days/First/${thisYear + 1
        }`
      )

      const gazPrices = await gaz.data.results.items.map((price: { close: any }) => price.close)
      const gazDates = gaz.data.results.items.map(
        (date: { tradedatetimegmt: any }) => date.tradedatetimegmt
      )
      const gazLastBaseload = gazPrices[gazPrices.length - 1]
      const gazLastDate = gazDates[gazDates.length - 1]

      const gazData = {
        cal1: {
          prices: cal1Base.data.results.items.map((p: { close: any }) => p.close),
          dates: cal1Base.data.results.items.map(
            (d: { tradedatetimegmt: any }) => d.tradedatetimegmt
          ),
        },
        cal2: {
          prices: cal2Base.data.results.items.map((p: { close: any }) => p.close),
          dates: cal2Base.data.results.items.map(
            (d: { tradedatetimegmt: any }) => d.tradedatetimegmt
          ),
        },
        gaz: {
          prices: gazPrices,
          dates: gazDates,
          lastBaseload: gazLastBaseload,
          lastDate: gazLastDate,
        },
      }

      const variations = {
        gaz: {
          max: Math.max(...gazData.gaz.prices),
          min: Math.min(...gazData.gaz.prices),
          avg: calculateAverage(gazData.gaz.prices),
          last: gazLastBaseload,
          variat: Math.round(
            gazData.gaz.prices[gazData.gaz.prices.length - 5] -
            gazData.gaz.prices[gazData.gaz.prices.length - 1]
          ),
        },

        cal1: {
          max: Math.max(...gazData.cal1.prices),
          min: Math.min(...gazData.cal1.prices),
          avg: calculateAverage(gazData.cal1.prices),
          last: gazData.cal1.prices[gazData.cal1.prices.length - 1],
          variat: Math.round(
            gazData.cal1.prices[gazData.cal1.prices.length - 5] -
            gazData.cal1.prices[gazData.cal1.prices.length - 1]
          ),
        },

        cal2: {
          max: Math.max(...gazData.cal2.prices),
          min: Math.min(...gazData.cal2.prices),
          avg: calculateAverage(gazData.cal2.prices),
          last: gazData.cal2.prices[gazData.cal2.prices.length - 1],
          variat: Math.round(
            gazData.cal2.prices[gazData.cal2.prices.length - 5] -
            gazData.cal2.prices[gazData.cal2.prices.length - 1]
          ),
        },
      }

      return view.render('pages.market.gaz', { gazData, variations })

    } catch (error) {
      // Handle the error or exception here
      console.error('une erreur est survenue dans le gaz naturel:', error)
      // You can return an error view or redirect to an error page
      return view.render('errors/error', { error })
    }
  }
  public async gazSpot({ response, params, view }: HttpContextContract) {
    const options = {
      method: 'GET',
      url: 'https://webservice-eex.gvsi.com/query/json/getDaily/close/onexchtradevolumeeex/tradedatetimegmt/',
      params: {
        priceSymbol: '"#E.PEG_GND1"',
        chartstartdate: params.start === null ? today : params.start,
        chartstopdate: params.end === null ? today : params.end,
        dailybarinterval: params.interval,
        aggregatepriceselection: params.order,
      },
      headers: { Origin: 'https://www.eex.com', Referer: 'https://www.eex.com/' },
    }

    try {
      const axiosResponse = await axios.request(options)
      response.send(axiosResponse.data)
    } catch (error) {
      // Handle the error or exception here
      console.error('une erreur est survenue dans le tableau de bord:', error)
      // You can return an error view or redirect to an error page
      return view.render('errors/error', { error })
    }
  }
  public async gazFutur({ response, params, view }: HttpContextContract) {
    try {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://webservice-eex.gvsi.com/query/json/getDaily/close/offexchtradevolumeeex/onexchtradevolumeeex/tradedatetimegmt/?priceSymbol=%22%2FE.G5BYF${calendar(
          params.cal
        )}%22&chartstartdate=${params.start}&chartstopdate=${params.end}&dailybarinterval=${params.interval
          }&aggregatepriceselection=${params.order}`,
        headers: {
          Origin: ' https://www.eex.com',
          Referer: ' https://www.eex.com/',
        },
      }

      const data = await axios
        .request(config)
        .then((resp) => {
          let futursPrices = JSON.stringify(resp.data)
          return futursPrices
        })
        .catch((error) => {
          console.log(error)
        })

      response.send(data)

    } catch (error) {
      // Handle the error or exception here
      console.error('une erreur est survenue dans le gaz naturel:', error)
      // You can return an error view or redirect to an error page
      return view.render('errors/error', { error })
    }
  }
  public async endOfDay({ response }: HttpContextContract) {
    const options = {
      method: 'GET',
      url: `https://webservice-eex.gvsi.com/query/json/getDaily/close/onexchtradevolumeeex/tradedatetimegmt/?priceSymbol=%22%23E.PEG_GND1%22&chartstartdate=2023%2F05%2F26&chartstopdate=2023%2F07%2F12&dailybarinterval=Days&aggregatepriceselection=First`,
      headers: { Origin: 'https://www.eex.com', Referer: 'https://www.eex.com/' },
    }

    try {
      const axiosResponse = await axios.request(options)
      return response.json(axiosResponse.data)
    } catch (error) {
      console.error(error)
    }
  }

}
