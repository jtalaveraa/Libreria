import { LucidRow } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { BaseModel } from '@ioc:Adonis/Lucid/Orm'

// Consulta opcional para verificar nulos en la columna `deleted_at`
export const softDeleteQuery = (query: ModelQueryBuilderContract<typeof BaseModel>) => {
    query.whereNull('deleted_at')
}

export const softDelete = async (row: LucidRow, column: string = 'deletedAt') => {
    if (!row[column]) {

        row[column] = DateTime.local()
    } else {

        row[column] = true
    }
    await row.save()

}

export const restore = async (row: LucidRow, column: string = 'deletedAt') => {
    if (row[column]) { 
        row[column] = null 
        await row.save()
    }
}

