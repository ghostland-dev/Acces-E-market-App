import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class News extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public image: string

  @column()
  public titre: string

  @column()
  public resumee: string

  @column()
  public description: string

  @column()
  public auteur: string

  @column()
  public source: string

  @column()
  public publie: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
