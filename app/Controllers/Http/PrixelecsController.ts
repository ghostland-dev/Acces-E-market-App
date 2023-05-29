import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Electrecity from 'App/Models/Electrecity'

export default class PrixelecsController {
  public async index({ view }: HttpContextContract) {

    const Electrecites = await Electrecity.all()

    return view.render('pages.db.elec.index', { Electrecites })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('pages.db.elec.create')
  }

  public async store({ request, response }: HttpContextContract) {
    const { prix_base, prix_peak, prix_max_base, prix_min_base, prix_avg_base, prix_max_peak, prix_min_peak, prix_avg_peak, date_enregistrement } = request.body()

    const electrcite = await new Electrecity()
    electrcite.prix_base = prix_base
    electrcite.prix_peak = prix_peak
    electrcite.prix_max_base = prix_max_base
    electrcite.prix_avg_base = prix_avg_base
    electrcite.prix_min_base = prix_min_base
    electrcite.prix_max_peak = prix_max_peak
    electrcite.prix_avg_peak = prix_avg_peak
    electrcite.prix_min_peak = prix_min_peak
    electrcite.date_enregistrement = date_enregistrement
    electrcite.save()

    return response.redirect().toRoute('electricite.index')

  }

  public async show({ view, params }: HttpContextContract) {
    const electrecite = await Electrecity.findOrFail((params.id))
    return view.render('pages.db.elec.show', { electrecite })
  }

  public async edit({ view, params }: HttpContextContract) {

    const electrecite = await Electrecity.findOrFail((params.id))

    return view.render('pages.db.elec.edit', { electrecite })
  }

  public async update({ request, view, params }: HttpContextContract) {
    const electrecite = await Electrecity.findOrFail((params.id))
    electrecite.merge(request.all())
    electrecite.save()
    return view.render('pages.db.elec.show', { electrecite })
  }

  public async destroy({ response, params }: HttpContextContract) {

    const electrecite = await Electrecity.findOrFail((params.id))
    electrecite.delete()
    return response.redirect().toRoute('electricite.index')
  }
}
