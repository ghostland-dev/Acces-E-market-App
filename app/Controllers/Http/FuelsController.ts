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

  public async store({ request, view }: HttpContextContract) {
   const fuel = await Fuel.create(request.all())

    return view.render('pages.db.petrole.show', { fuel })

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

  public async destroy({ view, params }: HttpContextContract) {

    const fuel = await Fuel.findOrFail((params.id))
    fuel.delete()
    return view.render('pages.db.petrole.index')
  }
}
