import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios'
import 'body-parser'

export default class DriversController {
  public async petrole({ params, response }: HttpContextContract) {
    const options = {
      method: 'POST',
      url: 'https://www.theice.com/marketdata/DelayedMarkets.shtml',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: {
        getHistoricalChartDataAsJson: '',
        marketId: '5430847',
        historicalSpan: params.period,
      },
    }

    try {
      const axiosResponse = await axios.request(options)
      // let dataList = axiosResponse.data.bars
      // let last = dataList[dataList.length - 1]

      response.send(axiosResponse.data)
      // response.send(last, dataList)
    } catch (error) {
      console.error(error)
    }
  }
  public async co2({ params, response }: HttpContextContract) {
    const options = {
      method: 'POST',
      url: 'https://www.theice.com/marketdata/DelayedMarkets.shtml',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: {
        getHistoricalChartDataAsJson: '',
        marketId: '6641766',
        historicalSpan: params.period,
      },
    }

    try {
      const axiosResponse = await axios.request(options)
      // let dataList = axiosResponse.data.bars
      // let last = dataList[dataList.length - 1]

      response.send(axiosResponse.data)
      // response.send(last, dataList)
    } catch (error) {
      console.error(error)
    }
  }
  public async charbon({ params, response }: HttpContextContract) {
    const options = {
      method: 'POST',
      url: 'https://www.theice.com/marketdata/DelayedMarkets.shtml',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: {
        getHistoricalChartDataAsJson: '',
        marketId: '5467847',
        historicalSpan: params.period,
      },
    }

    try {
      const axiosResponse = await axios.request(options)
      // let dataList = axiosResponse.data.bars
      // let last = dataList[dataList.length - 1]

      response.send(axiosResponse.data)
      // response.send(last, dataList)
    } catch (error) {
      console.error(error)
    }
  }

  public async drivers({ view, params, request }: HttpContextContract) {
    function avg(numbers: any[]) {
      const sum = numbers.reduce((a, b) => a + b, 0)
      const avg = Math.round(sum / numbers.length)
      return avg
    }
    const url = request.protocol() + '://' + request.host()
    const { id } = params

    const [petrole, charbon, co2] = await Promise.all([
      axios.get(url + '/api/v1/e-market/petrole/period/' + (id || 1)),
      axios.get(url + '/api/v1/e-market/charbon/period/' + (id || 1)),
      axios.get(url + '/api/v1/e-market/co2/period/' + (id || 1)),
    ])

    const driversLatest = {
      charbon: charbon.data.bars[charbon.data.bars.length - 1],
      petrole: petrole.data.bars[petrole.data.bars.length - 1],
      co2: co2.data.bars[co2.data.bars.length - 1],
    }

    const drivers = {
      charbon: {
        dates: charbon.data.bars.map(([date, _]) => date.slice(0, 10)),
        prices: charbon.data.bars.map(([_, price]) => price),
      },
      petrole: {
        dates: petrole.data.bars.map(([date, _]) => date.slice(0, 10)),
        prices: petrole.data.bars.map(([_, price]) => price),
      },
      co2: {
        dates: co2.data.bars.map(([date, _]) => date.slice(0, 10)),
        prices: co2.data.bars.map(([_, price]) => price),
      },
    }

    const variations = {
      charbon: {
        max: Math.max(...drivers.charbon.prices),
        min: Math.min(...drivers.charbon.prices),
        avg: avg(drivers.charbon.prices),
        last: drivers.charbon.prices[drivers.charbon.prices.length - 1],
        variat: Math.round(
          drivers.charbon.prices[drivers.charbon.prices.length - 1] -
            drivers.charbon.prices[drivers.charbon.prices.length - 5]
        ),
      },
      petrole: {
        max: Math.max(...drivers.petrole.prices),
        min: Math.min(...drivers.petrole.prices),
        avg: avg(drivers.petrole.prices),
        last: drivers.petrole.prices[drivers.petrole.prices.length - 1],
        variat: Math.round(
          drivers.petrole.prices[drivers.petrole.prices.length - 1] -
            drivers.petrole.prices[drivers.petrole.prices.length - 5]
        ),
      },
      co2: {
        max: Math.max(...drivers.co2.prices),
        min: Math.min(...drivers.co2.prices),
        avg: avg(drivers.co2.prices),
        last: drivers.co2.prices[drivers.co2.prices.length - 1],
        variat: Math.round(
          drivers.co2.prices[drivers.co2.prices.length - 1] -
            drivers.co2.prices[drivers.co2.prices.length - 5]
        ),
      },
    }

    return view.render('pages/market/drivers', { drivers, driversLatest, variations })
  }
}
