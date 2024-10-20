import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Bibliotecario from './Bibliotecario'

export default class Sucursal extends BaseModel {
  public static table = 'sucursales'

  @column({ isPrimary: true })
  public id: number

  @column()
  public nombre: string

  @column()
  public ubicacion: string

  @hasMany(() => Bibliotecario)
  public bibliotecarios: HasMany<typeof Bibliotecario>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  public deletedAt: DateTime | null

  public static softDeletes = true

}
