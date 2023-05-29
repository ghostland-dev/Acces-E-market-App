import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UtilisateursController {
  public async index({ view, session }: HttpContextContract) {
    const utilisateurs = await User.all()

    session.flash({
      notification: {
        type: 'success',
        message: `liste des utilisateurs 🥳 `,
      },
    })

    return view.render('pages/utilisateurs/index', { utilisateurs })
  }

  public async store({ request, view }: HttpContextContract) {
    const data = request.only(['name', 'email', 'password', 'role'])
    const utilisateur = await User.create(data)

    return view.render('pages/utilisateurs/show', { utilisateur })
  }

  public async show({ params, response, view }: HttpContextContract) {
    const utilisateur = await User.find(params.id)

    if (!utilisateur) {
      response.status(404).json({ message: 'utilisateur introuvable' })
      return
    }

    return view.render('pages/utilisateurs/show', { utilisateur })
  }

  public async edit({ params, view }: HttpContextContract) {
    const utilisateur = await User.find(params.id)



    return view.render('pages/utilisateurs/edit', { utilisateur })
  }


  public async update({ params, request, response, view }: HttpContextContract) {
    const utilisateur = await User.find(params.id)

    if (!utilisateur) {
      response.status(404).json({ message: 'utilisateur introuvable' })
      return view.render('pages/utilisateurs/show', { utilisateur })
    }

    const data = request.only(['name', 'email', 'password', 'role'])
    utilisateur.merge(data)
    await utilisateur.save()

    return view
  }

  public async destroy({ params, response }: HttpContextContract) {
    const utilisateur = await User.find(params.id)

    if (!utilisateur) {
      response.status(404).json({ message: 'utilisateur introuvable' })
      return
    }
    await utilisateur.delete()

    return response.redirect().toRoute('utilisateur.index')
  }
}
