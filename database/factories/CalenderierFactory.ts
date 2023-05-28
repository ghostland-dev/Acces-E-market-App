import Calenderier from 'App/Models/Calenderier'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Calenderier, ({ faker }) => {
  return {
    prix_base: parseFloat(faker.finance.amount()),
    prix_peak: parseFloat(faker.finance.amount()),
    prix_cal_01: parseFloat(faker.finance.amount()),
    prix_cal_02: parseFloat(faker.finance.amount()),
    prix_cal_03: parseFloat(faker.finance.amount()),
    prix_cal_04: parseFloat(faker.finance.amount()),
    prix_cal_05: parseFloat(faker.finance.amount()),
    prix_cal_06: parseFloat(faker.finance.amount()),
    date_enregistrement: faker.date.recent(),

  }
}).build()
