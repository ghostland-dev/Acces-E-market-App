
import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

test('display welcome page', async ({ client }) => {
  const response = await client.get('/')

  response.assertStatus(200)
  response.assertTextIncludes("true")
})
test('authentification - connexion', async ({ }) => {
  const response = await User.create({
    name: faker.name.lastName(),
    emailVerifiedAt: DateTime.local(),
    email: faker.internet.email(),
    password: 'password',
    role: faker.helpers.arrayElement([
      'commercial',
      'visiteur',
      'administrateur',
      'client',
      'partenaire',
    ]),
  }) ? true : false;

  response.assertStatus(200)
  response.assertTextIncludes("true")
})
