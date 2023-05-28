import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AlertFactory from 'Database/factories/AlertFactory'
import CalenderierFactory from 'Database/factories/CalenderierFactory'
import Co2Factory from 'Database/factories/Co2Factory'
import CoalFactory from 'Database/factories/CoalFactory'
import ElectrecityFactory from 'Database/factories/ElectrecityFactory'
import FuelFactory from 'Database/factories/FuelFactory'
import GazFactory from 'Database/factories/GazFactory'
import NewsFactory from 'Database/factories/NewsFactory'
import UserFactory from 'Database/factories/UserFactory'


export default class extends BaseSeeder {
  public async run() {
    await UserFactory.createMany(10)
    await AlertFactory.createMany(10)
    await GazFactory.createMany(10)
    await ElectrecityFactory.createMany(10)
    await CalenderierFactory.createMany(10)
    await CoalFactory.createMany(10)
    await Co2Factory.createMany(10)
    await FuelFactory.createMany(10)
    await NewsFactory.createMany(10)
  }
}
