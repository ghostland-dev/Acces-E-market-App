import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AlertFactory from 'Database/factories/AlertFactory'
import UserFactory from 'Database/factories/UserFactory'


export default class extends BaseSeeder {
  public async run() {
    await UserFactory.createMany(10)
    await AlertFactory.createMany(10)
  }
}
