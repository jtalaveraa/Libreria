import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Prestamo from './Prestamo'
import Reserva from './Reserva'
import Multa from './Multa'

export default class Miembro extends BaseModel {
  public static table = 'miembros'

  @column({ isPrimary: true })
  public id: number

  @column()
  public nombre: string

  @column()
  public correo_electronico: string

  @column.dateTime()
  public fecha_ingreso: DateTime

  @hasMany(() => Prestamo)
  public prestamos: HasMany<typeof Prestamo>

  @hasMany(() => Reserva)
  public reservas: HasMany<typeof Reserva>

  @hasMany(() => Multa)
  public multas: HasMany<typeof Multa>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  public deletedAt: DateTime | null

  public static softDeletes = true
}
