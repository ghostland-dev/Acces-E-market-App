import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Alert from 'App/Models/Alert'



export default class AlertsController {
  public async Alerts({ request, view, auth }: HttpContextContract) {
    const userId = auth.user?.id ? auth.user.id : 1
    const searchQuery = request.input('search');


    if (searchQuery) {

      const Alerts = await Alert.query()
        .where('nom', 'like', `%${searchQuery}%`)
        .orWhere('prenom', 'like', `%${searchQuery}%`)
        .orWhere('tel', 'like', `%${searchQuery}%`)
        .orWhere('email', 'like', `%${searchQuery}%`)
        .orWhere('siret', 'like', `%${searchQuery}%`)
        .orWhere('titre', 'like', `%${searchQuery}%`)
        .orWhere('energie', 'like', `%${searchQuery}%`)
        .orWhere('type', 'like', `%${searchQuery}%`)
        .orWhere('description', 'like', `%${searchQuery}%`)

      Alerts.findIndex((alert: Alert) => alert.userId === userId)



      return view.render('pages/alertes/index', { Alerts });
    } else {
      const Alerts = await Alert.all()
      Alerts.findIndex((alert: Alert) => alert.userId === userId)
      return view.render('pages/alertes/index', { Alerts });
    }

  }
  public async show({ params, view, session }: HttpContextContract) {
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
    alert.actif = actif ? true : false
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

  public async edit({ view, params, session }: HttpContextContract) {
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

    alert.actif = actif ? true : false
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

  public async delete({ params, response }: HttpContextContract) {
 
    const alert = await Alert.findOrFail(params.id)

    await alert.delete()

    return response.redirect().toRoute('alertes')
  }


  public async deleteAll({ response, session }: HttpContextContract) {
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
