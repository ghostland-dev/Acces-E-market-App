/* eslint-disable @typescript-eslint/naming-convention */
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import https from 'https'
import moment from 'moment'

let calendarElec = (year = actualYear, type = 'B') => {
  return `"/E.F7${type}YF${year}"`
}

const date = new Date()
const now = new Date()

const year = now.getFullYear()

const month = String(now.getMonth() + 1).padStart(2, '0')
const day = String(now.getDate()).padStart(2, '0')
const actualYear = date.getFullYear().toString().slice(2)
const Actualdate = new Date().toISOString().toString().slice(0, 10)
const jour = Actualdate.slice(8, 10)
let mois = parseInt(Actualdate.slice(5, 7)) - 2
const url = 'http://127.0.01:3333'

export default class ElectrcitiesController {
  public async electricityDetails({ view }: HttpContextContract) {
    function calculateAverage(numbers: any[]) {
      const sum = numbers.reduce((a, b) => a + b, 0)
      const avg = Math.round(sum / numbers.length)
      return avg
    }

    const month = (i: number) => {
      if (i < 10) {
        return `0${i}`
      } else {
        return `${i}`
      }
    }

    const cal1Base = await axios.get(
      `${url}/api/v1/elec/futur/debut/${year}-${month(mois)}-${jour}/fin/${Actualdate}/Days/First/${
        parseInt(actualYear) + 1
      }/B`
    )
    const cal2Base = await axios.get(
      `${url}/api/v1/elec/futur/debut/${year}-${month(mois)}-${jour}/fin/${Actualdate}/Days/First/${
        parseInt(actualYear) + 2
      }/B`
    )
    const cal3Base = await axios.get(
      `${url}/api/v1/elec/futur/debut/${year}-${month(mois)}-${jour}/fin/${Actualdate}/Days/First/${
        parseInt(actualYear) + 3
      }/B`
    )
    const cal1Peak = await axios.get(
      `${url}/api/v1/elec/futur/debut/${year}-${month(mois)}-${jour}/fin/${Actualdate}/Days/First/${
        parseInt(actualYear) + 1
      }/P`
    )
    const cal2Peak = await axios.get(
      `${url}/api/v1/elec/futur/debut/${year}-${month(mois)}-${jour}/fin/${Actualdate}/Days/First/${
        parseInt(actualYear) + 2
      }/P`
    )
    const cal3Peak = await axios.get(
      `${url}/api/v1/elec/futur/debut/${year}-${month(mois)}-${jour}/fin/${Actualdate}/Days/First/${
        parseInt(actualYear) + 3
      }/P`
    )

    const cals = {
      Base: {
        cal1: {
          prices: cal1Base.data.results.items.map((c: { close: any }) => c.close),
          dates: cal1Base.data.results.items.map((c: { tradedatetimegmt: any }) =>
            c.tradedatetimegmt.slice(0, 9)
          ),
        },
        cal2: {
          prices: cal2Base.data.results.items.map((c: { close: any }) => c.close),
          dates: cal2Base.data.results.items.map((c: { tradedatetimegmt: any }) =>
            c.tradedatetimegmt.slice(0, 9)
          ),
        },
        cal3: {
          prices: cal3Base.data.results.items.map((c: { close: any }) => c.close),
          dates: cal3Base.data.results.items.map((c: { tradedatetimegmt: any }) =>
            c.tradedatetimegmt.slice(0, 9)
          ),
        },
      },
      Peak: {
        cal1: {
          prices: cal1Peak.data.results.items.map((c: { close: any }) => c.close),
          dates: cal1Peak.data.results.items.map((c: { tradedatetimegmt: any }) =>
            c.tradedatetimegmt.slice(0, 9)
          ),
        },
        cal2: {
          prices: cal2Peak.data.results.items.map((c: { close: any }) => c.close),
          dates: cal2Peak.data.results.items.map((c: { tradedatetimegmt: any }) =>
            c.tradedatetimegmt.slice(0, 9)
          ),
        },
        cal3: {
          prices: cal3Peak.data.results.items.map((c: { close: any }) => c.close),
          dates: cal3Peak.data.results.items.map((c: { tradedatetimegmt: any }) =>
            c.tradedatetimegmt.slice(0, 9)
          ),
        },
      },
    }

    const variations = {
      peak: {
        cal1: {
          min: Math.min(...cals.Peak.cal1.prices),
          max: Math.max(...cals.Peak.cal1.prices),
          avg: calculateAverage(cals.Peak.cal1.prices),
          last: cals.Peak.cal1.prices[cals.Peak.cal1.prices.length - 1],
          variat: Math.round(
            cals.Peak.cal1.prices[cals.Peak.cal1.prices.length - 1] -
              cals.Peak.cal1.prices[cals.Peak.cal1.prices.length - 5]
          ),
        },
        cal2: {
          min: Math.min(...cals.Peak.cal2.prices),
          max: Math.max(...cals.Peak.cal2.prices),
          avg: calculateAverage(cals.Peak.cal2.prices),
          last: cals.Peak.cal2.prices[cals.Peak.cal2.prices.length - 1],
          variat: Math.round(
            cals.Peak.cal1.prices[cals.Peak.cal2.prices.length - 1] -
              cals.Peak.cal2.prices[cals.Peak.cal2.prices.length - 5]
          ),
        },
        cal3: {
          min: Math.min(...cals.Peak.cal3.prices),
          max: Math.max(...cals.Peak.cal3.prices),
          avg: calculateAverage(cals.Peak.cal3.prices),
          last: cals.Peak.cal3.prices[cals.Peak.cal3.prices.length - 1],
          variat: Math.round(
            cals.Peak.cal1.prices[cals.Peak.cal3.prices.length - 1] -
              cals.Peak.cal3.prices[cals.Peak.cal3.prices.length - 5]
          ),
        },
      },
      base: {
        cal1: {
          min: Math.min(...cals.Base.cal1.prices),
          max: Math.max(...cals.Base.cal1.prices),
          avg: calculateAverage(cals.Base.cal1.prices),
          last: cals.Base.cal1.prices[cals.Base.cal1.prices.length - 1],
          variat: Math.round(
            cals.Base.cal1.prices[cals.Base.cal1.prices.length - 1] -
              cals.Base.cal1.prices[cals.Base.cal1.prices.length - 5]
          ),
        },
        cal2: {
          min: Math.min(...cals.Base.cal2.prices),
          max: Math.max(...cals.Base.cal2.prices),
          avg: calculateAverage(cals.Base.cal2.prices),
          last: cals.Base.cal2.prices[cals.Base.cal2.prices.length - 1],
          variat: Math.round(
            cals.Base.cal2.prices[cals.Base.cal2.prices.length - 1] -
              cals.Base.cal2.prices[cals.Base.cal2.prices.length - 5]
          ),
        },
        cal3: {
          min: Math.min(...cals.Base.cal3.prices),
          max: Math.max(...cals.Base.cal3.prices),
          avg: calculateAverage(cals.Base.cal3.prices),
          last: cals.Base.cal3.prices[cals.Base.cal3.prices.length - 1],
          variat: Math.round(
            cals.Base.cal3.prices[cals.Base.cal3.prices.length - 1] -
              cals.Base.cal3.prices[cals.Base.cal3.prices.length - 5]
          ),
        },
      },
    }

    return view.render('pages/market/electrcite', { cals, variations })
  }

  public async electrcitySpot({ response, params }: HttpContextContract) {
    const options = {
      method: 'POST',
      url: 'https://www.epexspot.com/en/market-data',
      params: { ajax_form: '1', _wrapper_format: ['html', 'drupal_ajax'] },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Connection': 'keep-alive',
        'Host': 'www.epexspot.com',
        'Referer': `https://www.epexspot.com/en/market-data?market_area=AT&trading_date=${year}-${month}-${day}&delivery_date=${year}-${month}-${
          day + 1
        }&underlying_year=&modality=Auction&sub_modality=DayAhead&product=60&data_mode=graph&period=${
          params.period
        }`,
        'ajax_form': '1',
        '_wrapper_format': 'drupal_ajax',
      },
      data: `filters%5Bmodality%5D=Auction&filters%5Bsub_modality%5D=DayAhead&filters%5Btrading_date%5D=${day}%20${month}%20${year}&filters%5Bdelivery_date%5D=${
        day + 1
      }%20${month}%20${year}&filters%5Bproduct%5D=60&filters%5Bdata_mode%5D=graph&filters%5Bmarket_area%5D=AT&filters%5Bperiod%5D=${
        params.period
      }&triggered_element=filters%5Bdata_mode%5D&first_triggered_date=&form_build_id=form-PtdHvSGPvXq4x0229zJXzzvgM0b6FfyjO2BZWzc6oAY&form_id=market_data_filters_form&_triggering_element_name=submit_js&_triggering_element_value=&_drupal_ajax=1&ajax_page_state%5Btheme%5D=epex&ajax_page_state%5Btheme_token%5D=&ajax_page_state%5Blibraries%5D=bootstrap%2Fpopover%2Cbootstrap%2Ftooltip%2Ccore%2Fhtml5shiv%2Ccore%2Fjquery.form%2Cepex%2Fglobal-scripts%2Cepex%2Fglobal-styling%2Cepex_core%2Fdata-disclaimer%2Cepex_market_data%2Fauc_status%2Cepex_market_data%2Ffilters%2Cepex_market_data%2Fgraphs%2Cepex_market_data%2Fmap%2Cepex_market_data%2Ftables%2Ceu_cookie_compliance%2Feu_cookie_compliance_default%2Cstatistics%2Fdrupal.statistics%2Csystem%2Fbase`,
    }

    try {
      const apiResponse = await axios.request(options)
      const responseData = JSON.parse(apiResponse.data[0].settings.charts.price)
      response.send(responseData.data)
    } catch (error) {
      console.error(error)
    }
  }

  public async electrcityFutur({ response, params }: HttpContextContract) {
    const options = {
      method: 'GET',
      url: 'https://webservice-eex.gvsi.com/query/json/getDaily/close/offexchtradevolumeeex/onexchtradevolumeeex/tradedatetimegmt/',
      params: {
        priceSymbol: calendarElec(params.calenderier, params.type),
        chartstartdate: params.start,
        chartstopdate: params.end,
        dailybarinterval: params.interval,
        aggregatepriceselection: params.order,
      },
      headers: { Origin: 'https://www.eex.com', Referer: 'https://www.eex.com/' },
    }

    try {
      const axiosResponse = await axios.request(options)
      response.send(axiosResponse.data)
    } catch (error) {
      console.error(error)
    }
  }

  public async electrcityFuturCals({ response, params }: HttpContextContract) {
    const options = {
      method: 'GET',
      url: 'https://webservice-eex.gvsi.com/query/json/getChain/gv.pricesymbol/gv.displaydate/gv.expirationdate/tradedatetimegmt/gv.eexdeliverystart/ontradeprice/close/onexchsingletradevolume/onexchtradevolumeeex/offexchtradevolumeeex/openinterest/',
      params: {
        optionroot:
          params.option === 'B'
            ? `"'/E.FE${params.option}${params.interval}'"`
            : `"'/E.FV${params.option}${params.interval}'"`,
        expirationdate: params.expDate,
      },
      headers: { Origin: 'https://www.eex.com', Referer: 'https://www.eex.com/' },
    }

    try {
      const axiosResponse = await axios.request(options)
      response.json(axiosResponse.data)
    } catch (error) {
      console.error(error)
    }
  }

  public async fetchElectricityData({ response, request, params }: HttpContextContract) {
    try {
      console.log(params.trading_date)

      const { trading_date, delivery_date } = request.body()

      // http://127.0.01:3333/app/v1/electrcite/data
      // http://127.0.01:3333/app/v1/electrcite/data
      // const phpFileUrl = 'http://127.0.01:3333/electricite-base-data'
      //const phpFileUrl = 'http://127.0.01:3333/electricite-base-data'
      const phpFileUrl = `http://127.0.01:8000/electricity?trading_date=${trading_date}&delivery_date=${delivery_date}`
      // const phpFileUrl = 'http://127.0.01:3333/app/v1/electrcite/data'
      const result = await axios.get(phpFileUrl)

      // Process the response data from the PHP file
      const data = await result.data

      // Send the processed data as a response
      response.status(200).json(data)
    } catch (error) {
      console.error(error)
      response.status(500).json({ error: 'Something went wrong while fetching the data .' })
    }
  }

  public async baseload({ response }: HttpContextContract) {
    const sslCertificate = fs.readFileSync('app/Controllers/Http/Electrcity/epexspot.crt')
    const httpsAgent = new https.Agent({
      ca: sslCertificate,
    })

    // Current date
    const currentDate = moment().format('D MMM. YYYY')

    // Yesterday's date
    const yesterdayDate = moment().subtract(1, 'days').format('D MMM. YYYY')
    const tomorrowDate = moment().add(1, 'days').format('D MMM. YYYY')

    let data = new FormData()
    data.append('filters[modality]', 'Auction')
    data.append('filters[sub_modality]', 'DayAhead')
    data.append('filters[trading_date]', yesterdayDate)
    data.append('filters[delivery_date]', currentDate)
    data.append('filters[product]', '60')
    data.append('filters[data_mode]', 'graph')
    data.append('filters[market_area]', 'FR')
    data.append('filters[period]', 'year')
    data.append('triggered_element', 'filters[data_mode]')
    data.append('first_triggered_date', '')
    data.append('form_build_id', 'form-CQF0TGe9qNeA7s5RmVwwL95DMqqNCgkEVht9nZvyNvA')
    data.append('form_id', 'market_data_filters_form')
    data.append('_triggering_element_name', 'submit_js')
    data.append('_triggering_element_value', '')
    data.append('_drupal_ajax', '1')
    data.append('ajax_page_state[theme]', 'epex')
    data.append('ajax_page_state[theme_token]', '')
    data.append(
      'ajax_page_state[libraries]',
      'bootstrap/popover,bootstrap/tooltip,core/html5shiv,core/jquery.form,epex/global-scripts,epex/global-styling,epex_core/data-disclaimer,epex_market_data/auc_status,epex_market_data/filters,epex_market_data/graphs,epex_market_data/map,eu_cookie_compliance/eu_cookie_compliance_default,statistics/drupal.statistics,system/base'
    )

    const config = {
      method: 'post',
      url: 'https://www.epexspot.com/en/market-data?ajax_form=1&_wrapper_format=html&_wrapper_format=drupal_ajax',
      headers: {
        Accept: 'application/json',
        Cookie:
          'epex-data-use-agreed=1; cookie-agreed-categories=["functional","analytics"]; cookie-agreed=2',
        Host: 'www.epexspot.com',
        Origin: 'https://www.epexspot.com',
        Referer: `https://www.epexspot.com/en/market-data?market_area=AT&trading_date=${encodeURIComponent(
          yesterdayDate
        )}&delivery_date=${encodeURIComponent(
          currentDate
        )}&underlying_year=&modality=Auction&sub_modality=DayAhead&technology=&product=60&data_mode=graph&period=&production_period=`,
      },
      data: data,
      timeout: 0,
      httpsAgent: httpsAgent,
    }

    await axios
      .request(config)
      .then((resp: { data: any }) => {
        const main = {
          peakload: JSON.parse(resp.data[0].settings.charts.volume_period.peakload),
          baseload: JSON.parse(resp.data[0].settings.charts.volume_period.baseload),
        }

        return response.json(main)
      })
      .catch((error: any) => {
        console.log(error)
      })
  }
}
