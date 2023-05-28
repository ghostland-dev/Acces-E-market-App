
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class ApiController {
  public async getUsers({ response }: HttpContextContract) {
    const users = await User.all()

    return response.json(users)
  }

  public async getUser({ response, params }: HttpContextContract) {
    const user = await User.findOrFail(params.id)

    return response.json(user)
  }

  public async createUser({ response, request }: HttpContextContract) {
    const data = request.only(['name', 'email', 'password'])

    const user = await User.create(data)

    return response.json(user)
  }

  public async updateUser({ response, request, params }: HttpContextContract) {
    const data = request.only(['name', 'email', 'password'])

    const user = await User.findOrFail(params.id)

    user.merge(data)

    await user.save()

    return response.json(user)
  }

  public async deleteUser({ response, params }: HttpContextContract) {
    const user = await User.findOrFail(params.id)

    await user.delete()

    return response.json({ message: 'User deleted successfully' })
  }
}
