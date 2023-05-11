import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Alert from 'App/Models/Alert'



export default class AlertsController {
  public async Alerts({ view }: HttpContextContract) {
    const Alerts = await Alert.all()



    return view.render('pages/alertes/index', { Alerts })
  }

  public async show({ params, view, session, auth }: HttpContextContract) {
    const alert = await Alert.findOrFail(params.id)

    session.flash({
      notification: {
        type: 'success',
        message: `Détails de l'alerte "${alert.titre}" a été toruvé avec succès 🥳 `,
      },
    })

    return view.render('pages.alertes.show', { alert })
  }

  public async create({ request, response, session, auth }: HttpContextContract) {
    const { titre, min, max, type, energie, description, nom, prenom, tel, email, siret, actif } = request.body()

    const id = auth.user?.id ?? 1

    const alert = new Alert()
    alert.nom = actif
    alert.titre = titre
    alert.nom = nom
    alert.prenom = prenom
    alert.tel = tel
    alert.email = email
    alert.siret = siret
    alert.min = min
    alert.max = max
    alert.type = type
    alert.energie = energie
    alert.description = description
    alert.userId = id

    await alert.save()

    session.flash({
      notification: {
        type: 'success',
        message: `Votre alerte "${alert.titre}" a été créé avec succès 🥳 `,
      },
    })

    return response.redirect().toRoute('alertes')
  }

  public async charbonAlert({ }: HttpContextContract) { }

  public async Co2Alert({ }: HttpContextContract) { }

  public async edit({ view, response, request, params, session, auth }: HttpContextContract) {
    const alert = await Alert.findOrFail(params.id)

    session.flash({
      notification: {
        type: 'success',
        message: `Détails de l'alerte "${alert.titre}" est prêt à être modifié 🥳 `,
      },
    })

    return view.render('pages/alertes/edit', { alert })

  }

  public async update({ params, request, response, session }: HttpContextContract) {
    const alert = await Alert.findOrFail(params.id)

    const { titre, min, max, type, energie, description, nom, prenom, tel, email, siret, actif } = request.body()

    alert.nom = actif
    alert.titre = titre
    alert.nom = nom
    alert.prenom = prenom
    alert.tel = tel
    alert.email = email
    alert.siret = siret
    alert.min = min
    alert.max = max
    alert.type = type
    alert.energie = energie
    alert.description = description



    await alert.save()

    session.flash({
      notification: {
        type: 'success',
        message: `Votre alerte "${alert.titre}" a été modifié avec succès 🥳 `,
      },
    })

    return response.redirect().toRoute('alerte.show', { id: alert.id })
  }

  public async delete({ request, params, response, session, auth }: HttpContextContract) {
    console.log('we got gere')
    const alert = await Alert.findOrFail(params.id)

    await alert.delete()

    return response.redirect().toRoute('alertes')
  }


  public async deleteAll({ request, params, response, session, auth }: HttpContextContract) {
    session.flash({
      notification: {
        type: 'danger',
        message: `tous les alertes ont été soupprimé avec succès 🥳 `,
      },
    })

    await Alert.truncate()

    return response.redirect().toRoute('alertes')
  }
}
