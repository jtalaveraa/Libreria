import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Libro from './Libro'
import Miembro from './Miembro'

export default class Prestamo extends BaseModel {
  public static table = 'prestamos'

  @column({ isPrimary: true })
  public id: number

  @column.dateTime()
  public fecha_prestamo: DateTime

  @column.dateTime()
  public fecha_devolucion: DateTime

  @column()
  public libroId: number

  @column()
  public miembroId: number

  @belongsTo(() => Libro)
  public libro: BelongsTo<typeof Libro>

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
