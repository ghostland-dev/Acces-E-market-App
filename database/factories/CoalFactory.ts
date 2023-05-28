import Coal from 'App/Models/Coal'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Coal, ({ faker }) => {
  return {
    prix: parseFloat(faker.finance.amount()),
    date_enregistrement: faker.date.recent()
  }
}).build()
