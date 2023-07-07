import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Alert from 'App/Models/Alert'
import axios, { AxiosResponse } from 'axios'

const date = new Date().toISOString().slice(0, 10)
const thisYear = parseInt(new Date().toISOString().slice(2, 4))

const todayDate = new Date().toISOString().slice(0, 10);

const lastmonth = new Date().toISOString().slice(0, 10).split('-').map(e => parseInt(e))[1] - 1




export default class DashboardController {
  public async dashboard({ view, params, request }: HttpContextContract) {
    try {
      const { id } = params
      const url = request.protocol() + '://' + request.host()


      let electrcite: AxiosResponse<any, any>
      let gaz: AxiosResponse<any, any>
      let driversLatest: { charbon: any; petrole: any; co2: any }

      function calculateAverage(numbers: any[]) {
        const sum = numbers.reduce((a, b) => a + b, 0)
        const avg = Math.round(sum / numbers.length)
        return avg
      }

      const [petrole, charbon, co2] = await Promise.all([
        axios.get(`${url}/api/v1/e-market/petrole/period/${id || 1}`),
        axios.get(`${url}/api/v1/e-market/charbon/period/${id || 1}`),
        axios.get(`${url}/api/v1/e-market/co2/period/${id || 1}`),
      ])

      electrcite = await axios.get(`${url}/electricite-base-data`)
      gaz = await axios.get(`${url}/api/v1/gaz/futur/start/2022-01-01/end/${encodeURIComponent(date)}/Days/First/${thisYear + 1}`)

      driversLatest = {
        charbon: charbon.data.bars[charbon.data.bars.length - 1],
        petrole: petrole.data.bars[petrole.data.bars.length - 1],
        co2: co2.data.bars[co2.data.bars.length - 1],
      }

      const gazPrices = gaz.data.results.items?.map((price: { close: any }) => price.close) || []
      const gazDates = gaz.data.results.items?.map((date: { tradedatetimegmt: any }) => date.tradedatetimegmt) || []
      const gazLastBaseload = gazPrices[gazPrices.length - 1] || 1
      const gazLastDate = gazDates[gazDates.length - 1] || new Date().toISOString().slice(0, 10)

      const electrciteBaseload = electrcite.data.BaseloadFiltred || []
      const electrcitePeakload = electrcite.data.PeakloadFiltred || []
      const electrciteDates = electrcite.data.HorodatageFiltred || new Date().toISOString().slice(0, 10)
      const electrciteLastBaseload = electrcite.data.lastBaseload || 1
      const electrciteLastPeakload = electrcite.data.lastPeakload || 1
      const electrciteLastDate = electrciteDates[electrciteDates.length - 1] || new Date().toISOString().slice(0, 10)

      const energieData = {
        gaz: {
          prices: gazPrices,
          dates: gazDates,
          lastBaseload: gazLastBaseload,
          lastDate: gazLastDate,
        },
        electrcite: {
          baseload: electrciteBaseload,
          peakload: electrcitePeakload,
          dates: electrciteDates,
          lastBaseload: electrciteLastBaseload,
          lastPeakload: electrciteLastPeakload,
          lastDate: electrciteLastDate,
        },
      }

      const variations = {
        elec: {
          base: {
            max: Math.max(...energieData.electrcite.baseload),
            min: Math.min(...energieData.electrcite.baseload),
            avg: calculateAverage(energieData.electrcite.baseload),
          },
          peak: {
            max: Math.max(...energieData.electrcite.peakload),
            min: Math.min(...energieData.electrcite.peakload),
            avg: calculateAverage(energieData.electrcite.peakload),
          },
        },
        gaz: {
          base: {
            max: Math.max(...energieData.gaz.prices),
            min: Math.min(...energieData.gaz.prices),
            avg: calculateAverage(energieData.gaz.prices),
          },
        },
      }

      const Alerts = await Alert.query()
        .where('max', '>=', energieData.electrcite.lastBaseload)
        .andWhere('min', '<=', energieData.electrcite.lastBaseload)

      return view.render('dashboard', { energieData, driversLatest, variations, Alerts })
    } catch (error) {
      // Handle the error or exception here
      console.error('An error occurred:', error)
      // You can return an error view or redirect to an error page
      return view.render('errors/error', { error })
    }
  }

  public async notifications({ view }: HttpContextContract): Promise<string> {
    return view.render('pages/notification/index')
  }
}
