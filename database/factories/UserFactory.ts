import User from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { DateTime } from 'luxon'

export default Factory.define(User, ({ faker }) => {
  return {
    name: faker.name.lastName(),
    emailVerifiedAt: DateTime.local(),
    email: faker.internet.email(),
    password: 'password-user',
    role: faker.helpers.arrayElement(['commercial', 'user', 'master', 'client'])

  }
}).build()
