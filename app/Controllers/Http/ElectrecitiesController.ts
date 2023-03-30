import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ElectrecitiesController {
  public async index({ view, params }: HttpContextContract) {

    let elecData = params.period

    return view.render('pages/market/electrcite', { elecData })
  }

  public async create({ }: HttpContextContract) { }

  public async store({ }: HttpContextContract) { }

  public async show({ }: HttpContextContract) { }

  public async edit({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}
