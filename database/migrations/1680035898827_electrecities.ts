import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'electrecities'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.float('prix_peak').nullable().defaultTo(0),
        table.float('prix_max_peak').nullable().defaultTo(0),
        table.float('prix_min_peak').nullable().defaultTo(0),
        table.float('prix_avg_peak').nullable().defaultTo(0),
        table.float('prix_base').nullable().defaultTo(0),
        table.float('prix_max_base').nullable().defaultTo(0),
        table.float('prix_min_base').nullable().defaultTo(0),
        table.float('prix_avg_base').nullable().defaultTo(0),
        table.dateTime('date_enregistrement').nullable(),

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
