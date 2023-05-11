import Alert from 'App/Models/Alert'
import Factory from '@ioc:Adonis/Lucid/Factory'




export default Factory.define(Alert, ({ faker }) => {
  return {
    actif: false,
    nom: faker.name.firstName("female"),
    prenom: faker.name.lastName("male"),
    tel: faker.phone.number("+33 02 ## ## ## ##"),
    email: faker.internet.email(),
    siret: faker.random.numeric(8),
    titre: faker.lorem.words(3),
    min: parseFloat(faker.finance.amount(5, 10)),
    max: parseFloat(faker.random.numeric(3)),
    type: faker.helpers.arrayElement(['urgent', 'important', 'informatif', 'préventif']),
    energie: faker.helpers.arrayElement(['gaz', 'electrecite', 'charbon', 'co2', 'petrole', 'charbon']),
    description: faker.lorem.paragraph(),
    userId: parseInt(faker.random.numeric())

  }
}).build()
