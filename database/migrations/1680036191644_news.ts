import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'news'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

       table.string('image').defaultTo('vide'),
        table.string('titre').defaultTo('vide'),
        table.text('resumee').defaultTo('vide'),
        table.text('description').defaultTo('vide'),
        table.string('auteur').defaultTo('vide'),
        table.string('source').defaultTo('vide'),
        table.boolean('publie').defaultTo(false),

        /**
         * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
         */
        table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
