import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Gaz from 'App/Models/Gaz'

export default class PrixgazsController {
  public async index({ view }: HttpContextContract) {

    const Gazs = await Gaz.all()

    return view.render('pages.db.gaz.index', { Gazs })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('pages.db.gaz.create')
  }

  public async store({ request, response }: HttpContextContract) {
    const { prix_base, prix_max_base, prix_min_base,  prix_avg_base,  date_enregistrement } = request.body()

    const gaz = new Gaz()
    gaz.prix_base = prix_base
    gaz.prix_max_base = prix_max_base
    gaz.prix_avg_base = prix_avg_base
    gaz.prix_min_base = prix_min_base
    gaz.date_enregistrement = date_enregistrement
    gaz.save()

    return response.redirect().toRoute('gaz.index')

  }

  public async show({ view, params }: HttpContextContract) {
    const gaz = await Gaz.findOrFail((params.id))
    return view.render('pages.db.gaz.show', { gaz })
  }

  public async edit({ view, params }: HttpContextContract) {

    const gaz = await Gaz.findOrFail((params.id))

    return view.render('pages.db.gaz.edit', { gaz })
  }

  public async update({ request, view, params }: HttpContextContract) {
    const gaz = await Gaz.findOrFail((params.id))
    gaz.merge(request.all())
    gaz.save()
    return view.render('pages.db.gaz.show', { gaz })
  }

  public async destroy({ response, params }: HttpContextContract) {

    const gaz = await Gaz.findOrFail((params.id))
    gaz.delete()
    return response.redirect().toRoute('gaz.index')
  }
}
