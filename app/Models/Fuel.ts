import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Fuel extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public prix: number

  @column()
  public date_enregistrement: Date

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
