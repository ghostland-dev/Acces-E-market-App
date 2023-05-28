import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Ws } from '@adonisjs/websocket-packet'


export default class PrixesController {

  public async priceUpdate({ request, response }: HttpContextContract) {

    const { price } = request.all()

    // Check if the price differs from yesterday's price
    // You can implement your own logic to retrieve yesterday's price
    const yesterdayPrice = 50 // Replace with your actual implementation
    const isPriceDifferent = price !== yesterdayPrice

    if (isPriceDifferent) {
      // Save the new price or perform any other desired action
      // You can implement your own logic to save the price change
      console.log(`Price changed: ${price}`)
    }

    Ws.oi.emit('price', price)

    return response.json({ success: true })
  }
  public async index({ }: HttpContextContract) { }

  public async create({ }: HttpContextContract) { }

  public async store({ }: HttpContextContract) { }

  public async show({ }: HttpContextContract) { }

  public async edit({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}
