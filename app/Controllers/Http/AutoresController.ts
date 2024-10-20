import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Autor from 'App/Models/Autor'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { softDelete, restore, softDeleteQuery } from 'App/Services/SoftDelete'
import { LucidRow } from '@ioc:Adonis/Lucid/Orm'

export default class AutoresController {

    public async insertar({ request, response }: HttpContextContract) {

        const autorShema = schema.create({
            nombre: schema.string({}, [rules.maxLength(255)]),
            fecha_nacimiento: schema.date.optional({ format: 'yyyy-MM-dd' })
        })

        const validatedData = await request.validate({ schema: autorShema })

        try {
            const autor = await Autor.create(validatedData)
            return response.status(201).json({
                message: 'Autor insertado con éxito',
                data: autor
            })
        } catch (error) {
            return response.status(500).json({
                message: 'Error al insertar el autor',
                error: error.message
            })
        }
    }

    public async buscarTodos({ response }: HttpContextContract) {

        try {
            const autores = await Autor.query().whereNull('deleted_at')

            return response.status(200).json(autores)
        } catch (error) {
            return response.status(500).json({
                message: 'Error al obtener los autores',
                error: error.message
            })
        }
    }

    public async buscarPorId({ params, response }: HttpContextContract) {
        try {
            const autor = await Autor.query().whereNull('deletedAt').where('id', params.id).first()

            if (!autor) {
                return response.status(404).json({
                    message: 'Autor no encontrado'
                })
            }

            return response.status(200).json(autor)
        } catch (error) {
            return response.status(500).json({
                message: 'Error al obtener el autor',
                error: error.message
            })
        }
    }

    public async editarPorId({ params, request, response }: HttpContextContract) {
            const autorSchema = schema.create({
                nombre: schema.string({}, [rules.maxLength(255)]),
                fecha_nacimiento: schema.date.optional({ format: 'yyyy-MM-dd' })
            })

            const validatedData = await request.validate({ schema: autorSchema })

            try {
                const autor = await Autor.query().whereNull('deletedAt').where('id', params.id).first()

                if (!autor) {
                    return response.status(404).json({
                        message: 'Autor no encontrado'
                    })
                }

                autor.merge(validatedData)
                await autor.save()

                return response.status(200).json({
                    message: 'Autor actualizado con éxito',
                    data: autor
                })
            } catch (error) {
                return response.status(400).json({
                    message: 'Error en la validación de datos',
                    errors: error.messages
                })
            }
    }

    public async eliminar({ params, response }: HttpContextContract) {
        const autores = await Autor.find(params.id)

        if (!autores) {
            return response.status(404).json({ message: 'Autor no encontrado' })
        }

        await softDelete(autores)

        return response.status(200).json({ message: 'Autor eliminado' })
    }


    public async restaurar({ params, response }: HttpContextContract) {
        const autor = await Autor.query().whereNotNull('deleted_at').where('id', params.id).first()

        if (!autor) {
            return response.status(404).json({ message: 'Autor no encontrado o no está eliminado' })
        }

        await restore(autor)

        return response.status(200).json({ message: 'Autor restaurado' })
    }
}
