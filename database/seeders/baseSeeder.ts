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
    const num = 20
    await UserFactory.createMany(num)
    await AlertFactory.createMany(num)
    await GazFactory.createMany(num)
    await ElectrecityFactory.createMany(num)
    await CalenderierFactory.createMany(num)
    await CoalFactory.createMany(num)
    await Co2Factory.createMany(num)
    await FuelFactory.createMany(num)
    await NewsFactory.createMany(num)
  }
}
