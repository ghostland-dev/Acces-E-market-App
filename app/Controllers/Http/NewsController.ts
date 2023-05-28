import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import News from 'App/Models/News'

export default class NewsController {
  public async index({ view }: HttpContextContract) {

    const Fuels = await News.all()

    return view.render('pages.db.news.index', { Fuels })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('pages.db.news.create')
  }

  public async store({ request, view }: HttpContextContract) {
    const news = await News.create(request.all())

    return view.render('pages.db.news.show', { news })

  }

  public async show({ view, params }: HttpContextContract) {
    const news = await News.findOrFail((params.id))
    return view.render('pages.db.news.show', { news })
  }

  public async edit({ view, params }: HttpContextContract) {

    const news = await News.findOrFail((params.id))

    return view.render('pages.db.news.edit', { news })
  }

  public async update({ request, view, params }: HttpContextContract) {
    const news = await News.findOrFail((params.id))
    news.merge(request.all())
    news.save()
    return view.render('pages.db.news.show', { news })
  }

  public async destroy({ view, params }: HttpContextContract) {

    const news = await News.findOrFail((params.id))
    news.delete()
    return view.render('pages.db.news.index')
  }
}
