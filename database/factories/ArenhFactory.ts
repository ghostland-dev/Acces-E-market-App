import Arenh from 'App/Models/Arenh'
import Factory from '@ioc:Adonis/Lucid/Factory'
 

export default Factory.define(Arenh, ({ faker }) => {
  return {
    prix: parseFloat(faker.finance.amount()),
    date_enregistrement: faker.date.soon(),
  }
}).build()
