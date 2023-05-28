import News from 'App/Models/News'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(News, ({ faker }) => {
  return {
    image: faker.image.food() ,
    titre: faker.lorem.slug() ,
    resumee: faker.lorem.sentences(3) ,
    description: faker.lorem.paragraphs(),
    auteur: faker.name.fullName(),
    source: faker.internet.url() ,
    publie: faker.helpers.arrayElement([true,false])
  }
}).build()
