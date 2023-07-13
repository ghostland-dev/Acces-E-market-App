import Route from '@ioc:Adonis/Core/Route'
import axios, { AxiosRequestConfig } from 'axios'

Route.get('/sendmailer', 'REST/MailController.alerteSend')


Route.get('/', async ({ view }) => {
  return view.render('home')
}).as('home')
Route.get('/test', async ({ response }) => {

  // const config: AxiosRequestConfig = {
  //   method: 'get',
  //   maxBodyLength: Infinity,
  //   url: `https://webservice-eex.gvsi.com/query/json/getDaily/close/offexchtradevolumeeex/onexchtradevolumeeex/tradedatetimegmt/?priceSymbol=${calendarElec(params.calenderier, params.type)}&chartstartdate=${params.start}&chartstopdate=${params.end}&dailybarinterval=Days&aggregatepriceselection=First`,
  //   headers: {
  //     'Referer': ' https://www.eex.com/'
  //   }
  // }
  const config: AxiosRequestConfig = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://webservice-eex.gvsi.com/query/json/getDaily/close/offexchtradevolumeeex/onexchtradevolumeeex/tradedatetimegmt/?priceSymbol= "/E.F7BYF24"&chartstartdate= 2023/01/17&chartstopdate= 2023/07/12&dailybarinterval= Days&aggregatepriceselection= First',
    headers: {
      'Referer': ' https://www.eex.com/'
    }
  };

  const results = await axios.request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return response.json(results)

})

/*
|--------------------------------------------------------------------------|
| 1. Auhtentification de l'utilisateur
| 2. Inscription de l'utilisateur
| 3. Connexion de l'utilisateur
|--------------------------------------------------------------------------|
*/

// Route.group(() => {
//   Route.get('/users', 'ApiController.getUsers')
//   Route.get('/users/:id', 'ApiController.getUser')
//   Route.post('/users', 'ApiController.createUser')
//   Route.put('/users/:id', 'ApiController.updateUser')
//   Route.delete('/users/:id', 'ApiController.deleteUser')
// }).prefix('/api/v1')

Route.group(() => {
  Route.get('/app/v1/electrcite/data', 'Electrcity/ElectrcitiesController.baseload').as('base.peak')

  /*
 |--------------------------------------------------------------------------|
 | 1. Tableau de bord
 | 2. Prix spot de gaz naturel
 | 3. Prix futur de gaz naturel
 |--------------------------------------------------------------------------|
 */

  Route.get('/marche-electrcite', 'Electrcity/ElectrcitiesController.electricityDetails').as(
    'marketElec'
  )
  Route.get('/electricite-base-data', 'Electrcity/ElectrcitiesController.fetchElectricityData').as(
    'baseDataElec'
  )

  /*
  |--------------------------------------------------------------------------|
  | 1. Prix de la fin de journée de gaz naturel
  | 2. Prix spot de gaz naturel
  | 3. Prix futur de gaz naturel
  |--------------------------------------------------------------------------|
  */

  Route.get('/api/v1/gaz/fin-journee', 'Gaz/GazsController.endOfDay').as('gazEndOfDay')
  Route.get(
    '/api/v1/gaz/spot/start/:start/end/:end/:interval/:order',
    'Gaz/GazsController.gazSpot'
  ).as('gazSpot')
  Route.get(
    '/api/v1/gaz/futur/start/:start/end/:end/:interval/:order/:cal',
    'Gaz/GazsController.gazFutur'
  ).as('futurGaz')

  /*
  |--------------------------------------------------------------------------|
  | 1. Prix de la fin de journée d'électricité
  | 2. Prix spot d'électricité
  | 3. Prix futur d'électricité
  |--------------------------------------------------------------------------|
  */

  Route.get('/api/v1/elec/spot/:period', 'Electrcity/ElectrcitiesController.electrcitySpot').as(
    'elecSpot'
  )
  Route.get(
    '/api/v1/elec/futur/debut/:start/fin/:end/:interval/:order/:calenderier/:type',
    'Electrcity/ElectrcitiesController.electrcityFutur'
  ).as('elecFutur')
  Route.get(
    '/api/v1/elec/futur/expiration/:expDate/option/:option/interval/:interval',
    'Electrcity/ElectrcitiesController.electrcityFuturCals'
  ).as('elecFuturCals')
  Route.get('/api/v1/elec/data', 'Electrcity/ElectrcitiesController.baseload').as('base')
  Route.get('/api/v1/elec/text', 'Electrcity/ElectrcitiesController.testing').as('test')

  /*
  |--------------------------------------------------------------------------|
  | 1. Prix de pétrole (€/Kw)
  | 2. Prix de Charbon (€/Kw)
  | 3. Prix de CO2 (€/Kw)
  |--------------------------------------------------------------------------|
  */

  Route.get('/api/v1/e-market/petrole/period/:period', 'Drivers/DriversController.petrole').as(
    'petrole'
  )
  Route.get('/api/v1/e-market/charbon/period/:period', 'Drivers/DriversController.charbon').as(
    'charbon'
  )
  Route.get('/api/v1/e-market/co2/period/:period', 'Drivers/DriversController.co2').as('co2')
  Route.get('/app/v1/e-market/co2/exports', 'Drivers/DriversController.co2export').as('co2export').middleware('auth')
  Route.get('/app/v1/e-market/co2/nuclaire', 'Drivers/DriversController.nuclear').as('nuclear').middleware('auth')

  /*
  |--------------------------------------------------------------------------|
  | 1. Gaz
  |--------------------------------------------------------------------------|
  */

  Route.get('marche-gaz', 'Gaz/GazsController.gazDetails').as('marketGaz')
  /*
  |--------------------------------------------------------------------------|
  | 1. Articles
  |--------------------------------------------------------------------------|
  */

  Route.get('api/v1/actualites', 'Feed/FeedsController.newsFlow').as('articles')
  /*
   |--------------------------------------------------------------------------|
   | 1. dashboard
   |--------------------------------------------------------------------------|
   */
  Route.get('dashboard/:id?', 'Dashboard/DashboardController.dashboard').as('dashboard')
  /*
  |--------------------------------------------------------------------------|
  | 1. Drivers
  |--------------------------------------------------------------------------|
  */
  Route.get('drivers', 'Drivers/DriversController.drivers').as('drivers')

  /*
  |--------------------------------------------------------------------------|
  | 1. Notification
  |--------------------------------------------------------------------------|
  */

  Route.get('notifications', 'Dashboard/DashboardController.notifications').as('notifications')
  Route.get('alertes', 'AlertsController.Alerts').as('alertes')
  Route.post('nouveau/alerte', 'AlertsController.create').as('nouveauAlerte')
  Route.post('alertes/supprimer/:id', 'AlertsController.delete').as('alerte.delete')
  Route.get('alertes/editer/:id', 'AlertsController.edit').as('alerte.edit')
  Route.post('alertes/modifier/:id', 'AlertsController.update').as('alerte.update')
  Route.get('alertes/details/:id', 'AlertsController.show').as('alerte.show')





  // Routes that require role-based permissions
  // Route.get('admin/dashboard', 'AdminController.dashboard')
  Route.get('utilisateurs', 'UtilisateursController.index').as('utilisateur.index').middleware(['role:administrateur'])
  Route.get('utilisateur/nouveau', 'UtilisateursController.create').as('utilisateur.create').middleware(['role:administrateur'])
  Route.get('utilisateur/:id/details', 'UtilisateursController.show').as('utilisateur.show').middleware(['role:administrateur'])
  Route.get('utilisateur/:id/editer', 'UtilisateursController.edit').as('utilisateur.edit').middleware(['role:administrateur'])
  Route.post('utilisateur/sauvgarder', 'UtilisateursController.store').as('utilisateur.store').middleware(['role:administrateur'])
  Route.post(':id/utilisateur/modifier', 'UtilisateursController.update').as('utilisateur.update').middleware(['role:administrateur'])
  Route.post('utilisateur/:id/supprimer', 'UtilisateursController.destroy').as('utilisateur.destroy').middleware(['role:administrateur'])
  Route.get('/options', async ({ view }) => { return view.render('pages/db/options') }).as('options').middleware(['role:administrateur'])


  Route.get('electricites', 'PrixelecsController.index').as('electricite.index')
  Route.get('electricite/nouveau', 'PrixelecsController.create').as('electricite.create')
  Route.get('electricite/:id/details', 'PrixelecsController.show').as('electricite.show')
  Route.get('electricite/:id/editer', 'PrixelecsController.edit').as('electricite.edit')
  Route.post('electricite/sauvgarder', 'PrixelecsController.store').as('electricite.store')
  Route.post(':id/electricite/modifier', 'PrixelecsController.update').as('electricite.update')
  Route.post('electricite/:id/supprimer', 'PrixelecsController.destroy').as('electricite.destroy')

  Route.get('gazs', 'PrixgazsController.index').as('gaz.index')
  Route.get('gaz/nouveau', 'PrixgazsController.create').as('gaz.create')
  Route.get('gaz/:id/details', 'PrixgazsController.show').as('gaz.show')
  Route.get('gaz/:id/editer', 'PrixgazsController.edit').as('gaz.edit')
  Route.post('gaz/sauvgarder', 'PrixgazsController.store').as('gaz.store')
  Route.post(':id/gaz/modifier', 'PrixgazsController.update').as('gaz.update')
  Route.post('gaz/:id/supprimer', 'PrixgazsController.destroy').as('gaz.destroy')

  Route.get('charbons', 'CoalsController.index').as('charbon.index')
  Route.get('charbon/nouveau', 'CoalsController.create').as('charbon.create')
  Route.get('charbon/:id/details', 'CoalsController.show').as('charbon.show')
  Route.get('charbon/:id/editer', 'CoalsController.edit').as('charbon.edit')
  Route.post('charbon/sauvgarder', 'CoalsController.store').as('charbon.store')
  Route.post(':id/charbon/modifier', 'CoalsController.update').as('charbon.update')
  Route.post('charbon/:id/supprimer', 'CoalsController.destroy').as('charbon.destroy')

  Route.get('co2s', 'Co2sController.index').as('co2.index')
  Route.get('co2/nouveau', 'Co2sController.create').as('co2.create')
  Route.get('co2/:id/details', 'Co2sController.show').as('co2.show')
  Route.get('co2/:id/editer', 'Co2sController.edit').as('co2.edit')
  Route.post('co2/sauvgarder', 'Co2sController.store').as('co2.store')
  Route.post(':id/co2/modifier', 'Co2sController.update').as('co2.update')
  Route.post('co2/:id/supprimer', 'Co2sController.destroy').as('co2.destroy')

  Route.get('fuels', 'FuelsController.index').as('fuel.index')
  Route.get('fuel/nouveau', 'FuelsController.create').as('fuel.create')
  Route.get('fuel/:id/details', 'FuelsController.show').as('fuel.show')
  Route.get('fuel/:id/editer', 'FuelsController.edit').as('fuel.edit')
  Route.post('fuel/sauvgarder', 'FuelsController.store').as('fuel.store')
  Route.post(':id/fuel/modifier', 'FuelsController.update').as('fuel.update')
  Route.post('fuel/:id/supprimer', 'FuelsController.destroy').as('fuel.destroy')

  Route.get('coals', 'CoalsController.index').as('coal.index')
  Route.get('coal/nouveau', 'CoalsController.create').as('coal.create')
  Route.get('coal/:id/details', 'CoalsController.show').as('coal.show')
  Route.get('coal/:id/editer', 'CoalsController.edit').as('coal.edit')
  Route.post('coal/sauvgarder', 'CoalsController.store').as('coal.store')
  Route.post(':id/coal/modifier', 'CoalsController.update').as('coal.update')
  Route.post('coal/:id/supprimer', 'CoalsController.destroy').as('coal.destroy')

  Route.get('news', 'NewsController.index').as('news.index')
  Route.get('news/nouveau', 'NewsController.create').as('news.create')
  Route.get('news/:id/details', 'NewsController.show').as('news.show')
  Route.get('news/:id/editer', 'NewsController.edit').as('news.edit')
  Route.post('news/sauvgarder', 'NewsController.store').as('news.store')
  Route.post(':id/news/modifier', 'NewsController.update').as('news.update')
  Route.post('news/:id/supprimer', 'NewsController.destroy').as('news.destroy')
})


/*
 |--------------------------------------------------------------------------|
 | 2. Authentification routes
 |--------------------------------------------------------------------------|
 */
Route.group(() => {
  Route.group(() => {
    Route.get('register', 'RegisterController.create').as('inscription')
    Route.post('register', 'RegisterController.store')

    Route.get('verification/new', 'EmailVerificationController.create')
    Route.post('verification', 'EmailVerificationController.store')
    Route.get('verification/:email', 'EmailVerificationController.verify').as('verification.verify')

    Route.get('login', 'AuthController.create').as('connexion')
    Route.post('login', 'AuthController.store')

    Route.get('forgot-password', 'PasswordResetRequestController.create')
    Route.post('forgot-password', 'PasswordResetRequestController.store')

    Route.get('reset-password/:token', 'PasswordResetController.create')
    Route.post('reset-password', 'PasswordResetController.store')
  }).middleware('guest')

  Route.group(() => {
    // Authentification
    Route.get('confirm-password', 'ConfirmPasswordController.create')
    Route.post('confirm-password', 'ConfirmPasswordController.store')
    Route.post('logout', 'AuthController.destroy')
  }).middleware('auth')
}).namespace('App/Controllers/Http/Auth')
