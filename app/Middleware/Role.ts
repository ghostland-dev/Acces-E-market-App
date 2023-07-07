import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Role {
  public async handle({ auth, response, session }: HttpContextContract, next: () => Promise<void>, allowedRoles: string[]) {
    const user = await auth.authenticate()

    if (!allowedRoles.includes(user?.role)) {

      session.flash({
        notification: {
          type: 'error',
          message: "désolé vous n'avez l'authorisation d'accès a ce chemin.😏",
        },
      })
      return response.redirect().back()
    }


    await next()
  }
}
