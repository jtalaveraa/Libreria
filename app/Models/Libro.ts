import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Autor from './Autor'
import Categoria from './Categoria'
import Editorial from './Editorial'

export default class Libro extends BaseModel {

  public static table = 'libros'

  @column({ isPrimary: true })
  public id: number

  @column()
  public titulo: string

  @column()
  public ano_publicacion: number

  @column()
  public autorId: number

  @column()
  public categoriaId: number

  @column()
  public editorialId: number

  @belongsTo(() => Autor)
  public autor: BelongsTo<typeof Autor>

  @belongsTo(() => Categoria)
  public categoria: BelongsTo<typeof Categoria>

  @belongsTo(() => Editorial)
  public editorial: BelongsTo<typeof Editorial>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  public deletedAt: DateTime | null

  public static softDeletes = true

}
