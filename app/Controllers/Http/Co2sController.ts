import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Co2 from 'App/Models/Co2'


export default class Co2sController {
  public async index({ view }: HttpContextContract) {

    const Co2s = await Co2.all()

    return view.render('pages.db.co2.index', { Co2s })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('pages.db.co2.create')
  }

  public async store({ request, response }: HttpContextContract) {
    const { prix, date_enregistrement } = request.body()

    const co2 = new Co2()
    co2.prix = prix
    co2.date_enregistrement = date_enregistrement
    co2.save()

    return response.redirect().toRoute('co2.index')

  }

  public async show({ view, params }: HttpContextContract) {
    const co2 = await Co2.findOrFail((params.id))
    return view.render('pages.db.co2.show', { co2 })
  }

  public async edit({ view, params }: HttpContextContract) {

    const co2 = await Co2.findOrFail((params.id))

    return view.render('pages.db.co2.edit', { co2 })
  }

  public async update({ request, view, params }: HttpContextContract) {
    const co2 = await Co2.findOrFail((params.id))
    co2.merge(request.all())
    co2.save()
    return view.render('pages.db.co2.show', { co2 })
  }

  public async destroy({ response, params }: HttpContextContract) {

    const co2 = await Co2.findOrFail((params.id))
    co2.delete()
    return response.redirect().toRoute('co2.index')
  }
}
