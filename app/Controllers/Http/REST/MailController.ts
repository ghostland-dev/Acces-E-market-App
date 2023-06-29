import Mail from '@ioc:Adonis/Addons/Mail'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Alert from 'App/Models/Alert'
import User from 'App/Models/User'
import axios, { AxiosResponse } from 'axios'
const date = new Date().toISOString().slice(0, 10)
const thisYear = parseInt(new Date().toISOString().slice(2, 4))

export default class MailController {
  public async alerteSend({ view, params, request, response }: HttpContextContract) {
    const { id } = params
    const url = request.protocol() + '://' + request.host()

    let electrcite: AxiosResponse<any, any>
    let gaz: AxiosResponse<any, any>

    const [petrole, charbon, co2] = await Promise.all([
      axios.get(`${url}/api/v1/e-market/petrole/period/` + (id || 1)),
      axios.get(`${url}/api/v1/e-market/charbon/period/` + (id || 1)),
      axios.get(`${url}/api/v1/e-market/co2/period/` + (id || 1)),
    ])

    electrcite = await axios.get(`${url}/electricite-base-data`)
    gaz = await axios.get(
      `${url}/api/v1/gaz/futur/start/2022-01-01/end/${encodeURIComponent(date)}/Days/First/${
        thisYear + 1
      }`
    )

    const gazPrices = gaz.data.results.items.map((price: { close: any }) => price.close) ?? []
    const gazDates =
      gaz.data.results.items.map((date: { tradedatetimegmt: any }) => date.tradedatetimegmt) ?? []
    const gazLastBaseload = gazPrices[gazPrices.length - 1] ?? 1
    const gazLastDate =
      gazDates[gazDates.length - 1] ?? new Date().toISOString.toString().slice(0, 10)

    const electrciteDates =
      electrcite.data.HorodatageFiltred ?? new Date().toISOString.toString().slice(0, 10)
    const electrciteLastBaseload = electrcite.data.lastBaseload ?? 1
    const electrciteLastPeakload = electrcite.data.lastPeakload ?? 1
    const electrciteLastDate =
      electrciteDates[electrciteDates.length - 1] ?? new Date().toISOString.toString().slice(0, 10)
    const energieData = {
      gaz: {
        lastBaseload: gazLastBaseload,
        lastDate: gazLastDate,
      },
      electrcite: {
        lastBaseload: electrciteLastBaseload,
        lastPeakload: electrciteLastPeakload,
        lastDate: electrciteLastDate,
      },
      drivers: {
        charbon: charbon.data.bars[charbon.data.bars.length - 1],
        petrole: petrole.data.bars[petrole.data.bars.length - 1],
        co2: co2.data.bars[co2.data.bars.length - 1],
      },
    }

    const Alerts = await Alert.query()
      .where('max', '>=', energieData.electrcite.lastBaseload)
      .andWhere('min', '<=', energieData.electrcite.lastBaseload)
    Alerts.forEach(async (element) => {
      let user = await User.findOrFail(element.id)

      await Mail.send((message) => {
        message
          .from('info@example.com')
          .to(element.email)
          .cc(user.email)
          .subject(`Alerte de changement des prix de ${element.energie} `)
          .htmlView('emails/alert', { user, element, energieData })
      })

      console.log(user.email)
    })

    return response.json([energieData, Alerts])
  }

  // public async create({}: HttpContextContract) {}

  // public async store({}: HttpContextContract) {}

  // public async show({}: HttpContextContract) {}

  // public async edit({}: HttpContextContract) {}

  // public async update({}: HttpContextContract) {}

  // public async destroy({}: HttpContextContract) {}
}
