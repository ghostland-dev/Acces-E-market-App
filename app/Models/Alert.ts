import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Alert extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public actif: boolean

  @column()
  public nom: string

  @column()
  public prenom: string

  @column()
  public tel: string

  @column()
  public email: string

  @column()
  public siret: string

  @column()
  public titre: string

  @column()
  public max: number

  @column()
  public min: number

  @column()
  public energie: string

  @column()
  public type: string

  @column()
  public description: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
