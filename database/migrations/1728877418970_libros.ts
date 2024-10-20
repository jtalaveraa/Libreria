import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'libros'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()
      table.text('titulo').notNullable()
      table.bigInteger('autor_id').unsigned().references('id').inTable('autores').onDelete('CASCADE')
      table.bigInteger('categoria_id').unsigned().references('id').inTable('categorias').onDelete('CASCADE')
      table.bigInteger('editorial_id').unsigned().references('id').inTable('editoriales').onDelete('CASCADE')
      table.integer('ano_publicacion')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
