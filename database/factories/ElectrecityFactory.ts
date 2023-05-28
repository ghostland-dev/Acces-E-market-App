import Electrecity from 'App/Models/Electrecity'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Electrecity, ({ faker }) => {
  return {

    prix_peak: parseFloat(faker.finance.amount()),
    prix_max_peak: parseFloat(faker.finance.amount()),
    prix_min_peak: parseFloat(faker.finance.amount()),
    prix_avg_peak: parseFloat(faker.finance.amount()),
    prix_base: parseFloat(faker.finance.amount()),
    prix_max_base: parseFloat(faker.finance.amount()),
    prix_min_base: parseFloat(faker.finance.amount()),
    prix_avg_base: parseFloat(faker.finance.amount()),
    date_enregistrement: faker.date.soon(),
  }
}).build()
