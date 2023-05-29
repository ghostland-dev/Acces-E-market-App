import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Coal from 'App/Models/Coal'

export default class CoalsController {
  public async index({ view }: HttpContextContract) {

    const Coals = await Coal.all()

    return view.render('pages.db.charbon.index', { Coals })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('pages.db.charbon.create')
  }

  public async store({ request, response }: HttpContextContract) {
    const { prix, date_enregistrement } = request.body()

    const coal = new Coal()
    coal.prix = prix
    coal.date_enregistrement = date_enregistrement
    coal.save()

    return response.redirect().toRoute('coal.index')


  }

  public async show({ view, params }: HttpContextContract) {
    const coal = await Coal.findOrFail((params.id))
    return view.render('pages.db.charbon.show', { coal })
  }

  public async edit({ view, params }: HttpContextContract) {

    const coal = await Coal.findOrFail((params.id))

    return view.render('pages.db.charbon.edit', { coal })
  }

  public async update({ request, view, params }: HttpContextContract) {
    const coal = await Coal.findOrFail((params.id))
    coal.merge(request.all())
    coal.save()
    return view.render('pages.db.charbon.show', { coal })
  }

  public async destroy({ response, params }: HttpContextContract) {

    const coal = await Coal.findOrFail((params.id))
    coal.delete()
    return response.redirect().toRoute('coal.index')
  }
}
