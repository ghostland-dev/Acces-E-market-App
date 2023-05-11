import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'alerts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.boolean('actif').nullable()
      table.string('nom').nullable()
      table.string('prenom').nullable()
      table.string('tel').nullable()
      table.string('email').nullable()
      table.string('siret').nullable()
      table.string('titre').nullable()
      table.float('max').nullable()
      table.float('min').nullable()
      table.string('type').nullable()
      table.string('energie').nullable()
      table.text('description').nullable()
      table
        .integer('user_id')
        .unsigned()
        .references('users.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
