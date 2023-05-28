import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Gaz extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public prix_base: number

  @column()
  public prix_max_base: number

  @column()
  public prix_min_base: number

  @column()
  public prix_avg_base: number

  @column()
  public date_enregistrement: Date

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
