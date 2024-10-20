import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Miembro from './Miembro'

export default class Multa extends BaseModel {
  public static table = 'multas'

  @column({ isPrimary: true })
  public id: number

  @column()
  public monto: number

  @column()
  public pagado: boolean

  @column()
  public miembroId: number

  @belongsTo(() => Miembro)
  public miembro: BelongsTo<typeof Miembro>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  public deletedAt: DateTime | null

  public static softDeletes = true

}
