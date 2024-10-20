import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Libro from './Libro'

export default class Categoria extends BaseModel {
  public static table = 'categorias'
  @column({ isPrimary: true })
  public id: number
  
  @column()
  public nombre: string

  @hasMany(() => Libro)
  public libros: HasMany<typeof Libro>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  public deletedAt: DateTime | null

  public static softDeletes = true
}
