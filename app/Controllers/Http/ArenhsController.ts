import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Arenh from 'App/Models/Arenh'

export default class ArenhsController {
  public async index({ view }: HttpContextContract) {

    const Arenhs = await Arenh.all()

    return view.render('pages.db.Arenh.index', { Arenhs })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('pages.db.Arenh.create')
  }

  public async store({ request, response }: HttpContextContract) {

    const { prix, date_enregistrement } = request.body()

    const arenh = new Arenh()
    arenh.prix = prix
    arenh.date_enregistrement = date_enregistrement
    arenh.save()

    return response.redirect().toRoute('arenh.index')

  }

  public async show({ view, params }: HttpContextContract) {
    const arenh = await Arenh.findOrFail((params.id))
    return view.render('pages.db.Arenh.show', { arenh })
  }

  public async edit({ view, params }: HttpContextContract) {

    const arenh = await Arenh.findOrFail((params.id))

    return view.render('pages.db.Arenh.edit', { arenh })
  }

  public async update({ request, view, params }: HttpContextContract) {
    const arenh = await Arenh.findOrFail((params.id))
    arenh.merge(request.all())
    arenh.save()
    return view.render('pages.db.Arenh.show', { arenh })
  }

  public async destroy({ response, params }: HttpContextContract) {

    const arenh = await Arenh.findOrFail((params.id))
    arenh.delete()
    return response.redirect().toRoute('arenh.index')
  }
}
