import Route from '@ioc:Adonis/Core/Route'
import axios, { AxiosResponse } from 'axios'
import moment from 'moment'
//import { BodyParser, json } from 'body-parser'

let calendar = (year = actualYear) => {
  return `/E.G5BYF${year}`
}

let calendarElec = (year = actualYear, type = "B") => {
  return `/E.F7${type}YF${year}`
}

const date = new Date()
const now = new Date()
const year = now.getFullYear()
const month = String(now.getMonth() + 1).padStart(2, '0')
const day = String(now.getDate()).padStart(2, '0')
const actualYear = (date.getFullYear()).toString().slice(2)



Route.get('/', async ({ view }) => {
  return view.render('home')
}).as('home')
// Market

Route.get('marche-electrcite/:period?', 'ElectrecitiesController.index').as('market')

Route.get('dashboard/:id?', async ({ view, params }) => {
  let response: AxiosResponse<any, any>
  const { id } = params;
  if (id != null) {
    response = await axios.get('http://127.0.0.1:3333/api/v1/e-market/petrole/period/' + id + "");
  } else {
    response = await axios.get('http://127.0.0.1:3333/api/v1/e-market/petrole/period/1');
  }

  let datas = response.data;
  let main = [];
  let prix = [];
  let lastPrice = response.data.settlementPrice
  let change = response.data.settlementPrice
  if (datas.bars) {
    main = datas.bars.map((bar) => (moment(bar[0], 'ddd MMM DD HH:mm:ss YYYY').format('YYYY-MM-DD')));
    prix = datas.bars.map((bar: any[]) => bar[1]);
  }


  return view.render('dashboard', { main, prix, change, lastPrice });
}).as('dashboard').middleware('auth')

Route.group(() => {
  Route.group(() => {
    Route.get('register', 'RegisterController.create')
    Route.post('register', 'RegisterController.store')

    Route.get('verification/new', 'EmailVerificationController.create')
    Route.post('verification', 'EmailVerificationController.store')
    Route.get('verification/:email', 'EmailVerificationController.verify').as('verification.verify')

    Route.get('login', 'AuthController.create')
    Route.post('login', 'AuthController.store')

    Route.get('forgot-password', 'PasswordResetRequestController.create')
    Route.post('forgot-password', 'PasswordResetRequestController.store')

    Route.get('reset-password/:token', 'PasswordResetController.create')
    Route.post('reset-password', 'PasswordResetController.store')
  }).middleware('guest')

  Route.group(() => {
    // Authentification
    Route.get('confirm-password', 'ConfirmPasswordController.create')
    Route.post('confirm-password', 'ConfirmPasswordController.store')
    Route.post('logout', 'AuthController.destroy')

  }).middleware('auth')
}).namespace('App/Controllers/Http/Auth')

Route.group(() => {

  /*é
|--------------------------------------------------------------------------|
| 1. Prix de la fin de journée de gaz naturel
| 2. Prix spot de gaz naturel
| 3. Prix futur de gaz naturel
|--------------------------------------------------------------------------|
*/
  /* http://localhost:3333/api/v1/gaz/fin-journee */
  Route.get('/api/v1/gaz/fin-journee', async ({ response }) => {
    const options = {
      method: 'GET',
      url: 'https://webservice-eex.gvsi.com/query/json/getQuotes/settledate/dir/',
      params: { priceSymbol: '"#E.PEG_GND1"' },
      headers: { Origin: 'https://www.eex.com', Referer: 'https://www.eex.com/' }
    }

    try {
      const axiosResponse = await axios.request(options)
      response.send(axiosResponse.data)
    } catch (error) {
      console.error(error)
    }
  })

  /* http://localhost:3333/api/v1/gaz/spot/start/2022-01-29/end/2022-06-29/days/First */
  Route.get('/api/v1/gaz/spot/start/:start/end/:end/:interval/:order', async ({ params, response }) => {
    const options = {
      method: 'GET',
      url: 'https://webservice-eex.gvsi.com/query/json/getDaily/close/onexchtradevolumeeex/tradedatetimegmt/',
      params: {
        priceSymbol: '"#E.PEG_GND1"',
        chartstartdate: params.start,
        chartstopdate: params.end,
        dailybarinterval: params.interval,
        aggregatepriceselection: params.order
      },
      headers: { Origin: 'https://www.eex.com', Referer: 'https://www.eex.com/' }
    }

    try {
      const axiosResponse = await axios.request(options)
      response.send(axiosResponse.data)
    } catch (error) {
      console.error(error)
    }
  })

  /* http://localhost:3333/api/v1/gaz/futur/start/2022-01-01/end/2023-02-01/Days/First/24 */
  Route.get('/api/v1/gaz/futur/start/:start/end/:end/:interval/:order/:cal', async ({ params, response }) => {
    const options = {
      method: 'GET',
      url: 'https://webservice-eex.gvsi.com/query/json/getDaily/close/offexchtradevolumeeex/onexchtradevolumeeex/tradedatetimegmt/',
      params: {
        priceSymbol: calendar(params.cal),
        chartstartdate: params.start,
        chartstopdate: params.end,
        dailybarinterval: params.interval,
        aggregatepriceselection: params.order
      },
      headers: { Origin: 'https://www.eex.com', Referer: 'https://www.eex.com/' }
    }

    try {
      const axiosResponse = await axios.request(options)
      response.send(axiosResponse.data)
    } catch (error) {
      console.error(error)
    }
  })

  /*
  |--------------------------------------------------------------------------|
  | 1. Prix de la fin de journée d'électricité
  | 2. Prix spot d'électricité
  | 3. Prix futur d'électricité
  |--------------------------------------------------------------------------|
  */

  Route.get(`/api/v1/elec/spot/:period`, async ({ params, response }) => {

    const options = {
      method: 'POST',
      url: 'https://www.epexspot.com/en/market-data',
      params: { ajax_form: '1', _wrapper_format: ['html', 'drupal_ajax'] },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Connection: 'keep-alive',
        Host: 'www.epexspot.com',
        Referer: `https://www.epexspot.com/en/market-data?market_area=AT&trading_date=${year}-${month}-${day}&delivery_date=${year}-${month}-${day + 1}&underlying_year=&modality=Auction&sub_modality=DayAhead&product=60&data_mode=graph&period=${params.period}`,
        ajax_form: '1',
        _wrapper_format: 'drupal_ajax'
      },
      data: `filters%5Bmodality%5D=Auction&filters%5Bsub_modality%5D=DayAhead&filters%5Btrading_date%5D=${day}%20${month}%20${year}&filters%5Bdelivery_date%5D=${day + 1}%20${month}%20${year}&filters%5Bproduct%5D=60&filters%5Bdata_mode%5D=graph&filters%5Bmarket_area%5D=AT&filters%5Bperiod%5D=${params.period}&triggered_element=filters%5Bdata_mode%5D&first_triggered_date=&form_build_id=form-PtdHvSGPvXq4x0229zJXzzvgM0b6FfyjO2BZWzc6oAY&form_id=market_data_filters_form&_triggering_element_name=submit_js&_triggering_element_value=&_drupal_ajax=1&ajax_page_state%5Btheme%5D=epex&ajax_page_state%5Btheme_token%5D=&ajax_page_state%5Blibraries%5D=bootstrap%2Fpopover%2Cbootstrap%2Ftooltip%2Ccore%2Fhtml5shiv%2Ccore%2Fjquery.form%2Cepex%2Fglobal-scripts%2Cepex%2Fglobal-styling%2Cepex_core%2Fdata-disclaimer%2Cepex_market_data%2Fauc_status%2Cepex_market_data%2Ffilters%2Cepex_market_data%2Fgraphs%2Cepex_market_data%2Fmap%2Cepex_market_data%2Ftables%2Ceu_cookie_compliance%2Feu_cookie_compliance_default%2Cstatistics%2Fdrupal.statistics%2Csystem%2Fbase`
    };

    try {
      const apiResponse = await axios.request(options)
      const responseData = JSON.parse(apiResponse.data[0].settings.charts.price)
      response.send(responseData.data)
    } catch (error) {
      console.error(error)
    }
  })



  Route.get('/api/v1/elec/futur/debut/:start/fin/:end/:interval/:order/:calenderier/:type', async ({ params, response }) => {
    const options = {
      method: 'GET',
      url: 'https://webservice-eex.gvsi.com/query/json/getDaily/close/offexchtradevolumeeex/onexchtradevolumeeex/tradedatetimegmt/',
      params: {
        priceSymbol: calendarElec(params.calenderier, params.type),
        chartstartdate: params.start,
        chartstopdate: params.end,
        dailybarinterval: params.interval,
        aggregatepriceselection: params.order
      },
      headers: { Origin: 'https://www.eex.com', Referer: 'https://www.eex.com/' }
    };

    try {
      const axiosResponse = await axios.request(options);
      response.send(axiosResponse.data);
    } catch (error) {
      console.error(error);
    }
  });


  Route.get('/api/v1/elec/futur/expiration/:expDate/option/:option/interval/:interval', async ({ params, response }) => {
    const options = {
      method: 'GET',
      url: 'https://webservice-eex.gvsi.com/query/json/getChain/gv.pricesymbol/gv.displaydate/gv.expirationdate/tradedatetimegmt/gv.eexdeliverystart/ontradeprice/close/onexchsingletradevolume/onexchtradevolumeeex/offexchtradevolumeeex/openinterest/',
      params: {
        optionroot: params.option === 'B' ? `"/E.FE${params.option}${params.interval}"` : `"/E.FV${params.option}${params.interval}"`,
        expirationdate: params.expDate
      },
      headers: { Origin: 'https://www.eex.com', Referer: 'https://www.eex.com/' }
    };

    try {
      const axiosResponse = await axios.request(options);
      response.json(axiosResponse.data);
    } catch (error) {
      console.error(error);
    }
  });


  Route.get('/api/v1/e-market/petrole/period/:period', async ({ params, response }) => {
    const options = {
      method: 'POST',
      url: 'https://www.theice.com/marketdata/DelayedMarkets.shtml',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: { getHistoricalChartDataAsJson: '', marketId: '5430847', historicalSpan: params.period }
    };

    try {
      const axiosResponse = await axios.request(options)
      response.send(axiosResponse.data)
    } catch (error) {
      console.error(error)
    }
  })

  Route.get('/api/v1/e-market/charbon/period/:period', async ({ params, response }) => {
    const options = {
      method: 'POST',
      url: 'https://www.theice.com/marketdata/DelayedMarkets.shtml',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: { getHistoricalChartDataAsJson: '', marketId: '5467847', historicalSpan: params.period }
    };

    try {
      const axiosResponse = await axios.request(options)
      response.send(axiosResponse.data)
    } catch (error) {
      console.error(error)
    }
  })

  Route.get('/api/v1/e-market/co2/period/:period', async ({ params, response }) => {
    const options = {
      method: 'POST',
      url: 'https://www.theice.com/marketdata/DelayedMarkets.shtml',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: { getHistoricalChartDataAsJson: '', marketId: '6641766', historicalSpan: params.period }
    };

    try {
      const axiosResponse = await axios.request(options)
      response.send(axiosResponse.data)
    } catch (error) {
      console.error(error)
    }
  })
})
