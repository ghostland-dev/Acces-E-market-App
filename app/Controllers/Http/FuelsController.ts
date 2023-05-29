import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Fuel from 'App/Models/Fuel'

export default class FuelsController {
  public async index({ view }: HttpContextContract) {

    const Fuels = await Fuel.all()

    return view.render('pages.db.petrole.index', { Fuels })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('pages.db.petrole.create')
  }

  public async store({ request, response }: HttpContextContract) {

    const { prix, date_enregistrement } = request.body()

    const fuel = new Fuel()
    fuel.prix = prix
    fuel.date_enregistrement = date_enregistrement
    fuel.save()

    return response.redirect().toRoute('fuel.index')

  }

  public async show({ view, params }: HttpContextContract) {
    const fuel = await Fuel.findOrFail((params.id))
    return view.render('pages.db.petrole.show', { fuel })
  }

  public async edit({ view, params }: HttpContextContract) {

    const fuel = await Fuel.findOrFail((params.id))

    return view.render('pages.db.petrole.edit', { fuel })
  }

  public async update({ request, view, params }: HttpContextContract) {
    const fuel = await Fuel.findOrFail((params.id))
    fuel.merge(request.all())
    fuel.save()
    return view.render('pages.db.petrole.show', { fuel })
  }

  public async destroy({ response, params }: HttpContextContract) {

    const fuel = await Fuel.findOrFail((params.id))
    fuel.delete()
    return response.redirect().toRoute('fuel.index')
  }
}
