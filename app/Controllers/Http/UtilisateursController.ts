import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UtilisateursController {
  public async index({ view , session }: HttpContextContract) {
    const users = await User.all()

    session.flash({
      notification: {
        type: 'success',
        message: `liste des utilisateurs 🥳 `,
      },
    })

    return view.render('pages/utilisateurs/index', { users })
  }

  public async store({ request, response }: HttpContextContract) {
    const data = request.only(['username', 'email', 'password'])
    const user = await User.create(data)
    response.status(201).json(user)
  }

  public async show({ params, response }: HttpContextContract) {
    const user = await User.find(params.id)

    if (!user) {
      response.status(404).json({ message: 'User not found' })
      return
    }

    response.status(200).json(user)
  }

  public async update({ params, request, response }: HttpContextContract) {
    const user = await User.find(params.id)

    if (!user) {
      response.status(404).json({ message: 'User not found' })
      return
    }

    const data = request.only(['username', 'email', 'password'])
    user.merge(data)
    await user.save()

    response.status(200).json(user)
  }

  public async destroy({ params, response }: HttpContextContract) {
    const user = await User.find(params.id)

    if (!user) {
      response.status(404).json({ message: 'User not found' })
      return
    }

    await user.delete()
    response.status(204).json({ message: 'User deleted' })
  }
}
