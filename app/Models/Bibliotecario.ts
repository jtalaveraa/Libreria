import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Sucursal from './Sucursal'

export default class Bibliotecario extends BaseModel {
  public static table = 'bibliotecarios'

  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column()
  public nombre: string

  @column()
  public sucursalId: number

  @belongsTo(() => Sucursal)
  public sucursal: BelongsTo<typeof Sucursal>

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
  
  @column.dateTime({ autoCreate: false, autoUpdate: false })
  public deletedAt: DateTime | null

  public static softDeletes = true

}
