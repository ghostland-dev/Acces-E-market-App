import Co2 from 'App/Models/Co2'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Co2, ({ faker }) => {
  return {
    prix: parseFloat(faker.finance.amount()),
    date_enregistrement: faker.date.soon(),

  }
}).build()
