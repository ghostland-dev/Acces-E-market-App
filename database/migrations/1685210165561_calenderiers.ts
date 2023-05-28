import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'calenderiers'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.float('prix_base').nullable().defaultTo(0),
        table.float('prix_peak').nullable().defaultTo(0),
        table.float('prix_cal_01').nullable().defaultTo(0),
        table.float('prix_cal_02').nullable().defaultTo(0),
        table.float('prix_cal_03').nullable().defaultTo(0),
        table.float('prix_cal_04').nullable().defaultTo(0),
        table.float('prix_cal_05').nullable().defaultTo(0),
        table.float('prix_cal_06').nullable().defaultTo(0),
        table.datetime('date_enregistrement').nullable()
      


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
