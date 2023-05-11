import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'fuels'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.float('prix_baseload')
      table.float('prix_max')
      table.float('prix_min')
      table.float('prix_avg')
      table.date('date_cloture')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
