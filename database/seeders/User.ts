import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class extends BaseSeeder {
  public static environment = ['development', 'testing']
  public async run() {
    //await UserFactory.createMany(10)
  }
}
