import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Calenderier extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public prix_base: number

  @column()
  public prix_peak: number

  @column()
  public prix_cal_01: number

  @column()
  public prix_cal_02: number

  @column()
  public prix_cal_03: number

  @column()
  public prix_cal_04: number

  @column()
  public prix_cal_05: number

  @column()
  public prix_cal_06: number

  @column()
  public date_enregistrement: Date

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
