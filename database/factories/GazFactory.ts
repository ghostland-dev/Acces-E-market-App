import Gaz from 'App/Models/Gaz'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Gaz, ({ faker }) => {
  return {
    prix_base: parseFloat(faker.finance.amount()),
    prix_max_base: parseFloat(faker.finance.amount()),
    prix_min_base: parseFloat(faker.finance.amount()),
    prix_avg_base: parseFloat(faker.finance.amount()),
    date_enregistrement: faker.date.recent()
  }
}).build()
