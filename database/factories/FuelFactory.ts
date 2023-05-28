import Fuel from 'App/Models/Fuel'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Fuel, ({ faker }) => {
  return {
    prix: parseFloat(faker.finance.amount()),
    date_enregistrement: faker.date.recent()
  }
}).build()
