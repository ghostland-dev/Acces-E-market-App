import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Alert from 'App/Models/Alert'
import axios, { AxiosResponse } from 'axios'

const url = 'http://127.0.0.1:3333'
const date = new Date().toISOString().slice(0, 10)
const thisYear = parseInt(new Date().toISOString().slice(2, 4))

export default class DashboardController {
  public async dashboard({ request, view, params }: HttpContextContract) {

    const { id } = params

    console.log(params)
    let electrcite: AxiosResponse<any, any>, gaz: AxiosResponse<any, any>, driversLatest: { charbon: any; petrole: any; co2: any }

    function calculateAverage(numbers: any[]) {
      const sum = numbers.reduce((a, b) => a + b, 0)
      const avg = Math.round(sum / numbers.length)
      return avg
    }

    const [petrole, charbon, co2] = await Promise.all([
      axios.get(url + '/api/v1/e-market/petrole/period/' + (id || 1)),
      axios.get(url + '/api/v1/e-market/charbon/period/' + (id || 1)),
      axios.get(url + '/api/v1/e-market/co2/period/' + (id || 1)),
    ])


    electrcite = await axios.get(url + `/electricite-base-data`)
    gaz = await axios.get(url + `/api/v1/gaz/futur/start/2022-01-01/end/${encodeURIComponent(date)}/Days/First/${thisYear + 1}`)
    driversLatest = { charbon: charbon.data.bars[charbon.data.bars.length - 1], petrole: petrole.data.bars[petrole.data.bars.length - 1], co2: co2.data.bars[co2.data.bars.length - 1] }

    const gazPrices = gaz.data.results.items.map((price: { close: any }) => price.close) ?? []
    const gazDates = gaz.data.results.items.map((date: { tradedatetimegmt: any }) => date.tradedatetimegmt) ?? []
    const gazLastBaseload = gazPrices[gazPrices.length - 1] ?? 1
    const gazLastDate = gazDates[gazDates.length - 1] ?? new Date().toISOString.toString().slice(0, 10)
    const electrciteBaseload = electrcite.data.BaseloadFiltred ?? []
    const electrcitePeakload = electrcite.data.PeakloadFiltred ?? []
    const electrciteDates = electrcite.data.HorodatageFiltred ?? new Date().toISOString.toString().slice(0, 10)
    const electrciteLastBaseload = electrcite.data.lastBaseload ?? 1
    const electrciteLastPeakload = electrcite.data.lastPeakload ?? 1
    const electrciteLastDate = electrciteDates[electrciteDates.length - 1] ?? new Date().toISOString.toString().slice(0, 10)
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
    };
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
        }
      },
      gaz: {
        base: {
          max: Math.max(...energieData.gaz.prices),
          min: Math.min(...energieData.gaz.prices),
          avg: calculateAverage(energieData.gaz.prices),
        }
      }
    }
    // const { lastBaseload: elecBaseload, lastPeakload: elecPeakload } = energieData.electrcite;


    // Fetch the current price
    // async function fetchCurrentPrice() {
    //   try {

    //     return energieData.electrcite.lastBaseload;
    //   } catch (error) {
    //     console.error('Failed to fetch the current price:', error.message);
    //     return null;
    //   }
    // }

    // // Send an email notification
    // async function sendEmailNotification(nouveauPrix: any, nomProduit: any, prixPrecedent: any, email: string) {
    //   // Configure the email transporter

    //   try {
    //     // Send the email
    //     await Mail.send((message) => {
    //       message
    //         .to(email)
    //         .subject('Opportunité des prix')
    //         .htmlView('emails/alert', { nouveauPrix, nomProduit, prixPrecedent })
    //     })
    //     return true;
    //   } catch (error) {
    //     console.error('Failed to send email:', error.message);
    //   }
    // }

    // // Run the price check and email notification
    // async function runPriceCheck() {
    //   const currentPrice = await fetchCurrentPrice();
    //   if (currentPrice !== null) {

    //     await sendEmailNotification(currentPrice, "Electrcité", currentPrice, "ismail@gmail.com");

    //     console.log('Price check completed.');
    //   }
    // }

    // Execute the price check script
    // runPriceCheck();

    // const gazAlerts = await Alert.query().orWhere((query) => {
    //   query.where('min', '<=', gazBaseload)
    //     .andWhere('max', '>=', gazBaseload)
    //     .andWhere('energie', '=', 'gaz');

    // });

    // const co2Alerts = await Alert.query().orWhere((query) => {
    //   query.where('min', '<=', driversLatest.co2)
    //     .andWhere('max', '>=', driversLatest.co2)
    //     .andWhere('energie', '=', 'co2');
    // });

    // const charbonAlerts = await Alert.query().orWhere((query) => {
    //   query.where('min', '<=', driversLatest.charbon)
    //     .andWhere('max', '>=', driversLatest.charbon)
    //     .andWhere('energie', '=', 'charbon');
    // });

    // const petroleAlerts = await Alert.query().orWhere((query) => {
    //   query.where('min', '<=', driversLatest.petrole)
    //     .andWhere('max', '>=', driversLatest.petrole)
    //     .andWhere('energie', '=', 'petrole');
    // });



    // if (alerts.length > 0) {
    //   await Mail.send((message) => {
    //     message
    //       .to("ismail.mouyahada@gmail.com")
    //       .subject('Données')
    //       .htmlView('emails/alert', {
    //         alerts,
    //       })
    //   })
    // }


    const Alerts = await Alert.query()
      .where('max', '>=', energieData.electrcite.lastBaseload)
      .andWhere('min', '<=', energieData.electrcite.lastBaseload);


    return view.render('dashboard', { energieData, driversLatest, variations, Alerts })

  }

  public async notifications({ view }: HttpContextContract) {
    return view.render('pages/notification/index')

  }

  public async store({ }: HttpContextContract) { }

  public async show({ }: HttpContextContract) { }

  public async edit({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}
