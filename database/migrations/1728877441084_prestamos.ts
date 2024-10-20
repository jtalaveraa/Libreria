import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'prestamos'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()
      table.bigInteger('libro_id').unsigned().references('id').inTable('libros').onDelete('CASCADE')
      table.bigInteger('miembro_id').unsigned().references('id').inTable('miembros').onDelete('CASCADE')
      table.date('fecha_prestamo')
      table.date('fecha_devolucion')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
