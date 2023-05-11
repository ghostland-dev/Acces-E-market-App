import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { DateTime } from 'luxon'
import EmailValidator from 'App/Validators/EmailValidator'
import Event from '@ioc:Adonis/Core/Event'

export default class EmailVerificationController {
  public async verify({ request, params, session, response }: HttpContextContract) {
    if (!request.hasValidSignature()) {
      session.flash({
        notification: {
          type: 'error',
          message: 'Le lien de vérification est invalide ou expiré 🤕',
        },
      })

      return response.redirect('/verification/new')
    }

    const user = await User.findByOrFail('email', params.email)

    if (user.emailVerifiedAt) {
      session.flash({
        notification: {
          type: 'info',
          message: 'Cette adresse E-mail est préalablement vérifié. 🤔',
        },
      })

      return response.redirect('/login')
    }

    user.emailVerifiedAt = DateTime.now()
    await user.save()

    session.flash({
      notification: {
        type: 'success',
        message: '✅ l\'adresse mail verifié avec succès. 🥳',
      },
    })

    return response.redirect('/login')
  }

  public create({ view }: HttpContextContract) {
    return view.render('auth/resend-verification')
  }

  public async store({ request, session, response }: HttpContextContract) {
    const { email } = await request.validate(EmailValidator)

    const user = await User.findBy('email', email)

    if (user?.emailVerifiedAt) {
      session.flash({
        notification: {
          type: 'info',
          message: 'Cette adresse E-mail est déjà vérifié. 🤔',
        },
      })

      return response.redirect('/login')
    }

    Event.emit('userRegistered', user!)

    session.flash({
      notification: {
        type: 'success',
        message:
          'un lien de vérification a été envoyé vers votre boîte mail, veillez consulter votre boîte mail.',
      },
    })

    return response.redirect().back()
  }
}
