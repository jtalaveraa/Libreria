import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { softDelete, restore } from 'App/Services/SoftDelete'
import Libro from 'App/Models/Libro'

export default class LibrosController {

    public async insertar({ request, response }: HttpContextContract) {
        const libroSchema = schema.create({
            titulo: schema.string({}, [rules.required()]),
            autor_id: schema.string({}, [rules.required()]),
            editorial_id: schema.number([rules.required()]),
            ano_publicacion: schema.number([rules.range(1000, 9999)])
        })

        const validatedData = await request.validate({ schema: libroSchema })

        const libro = await Libro.create(validatedData)

        return response.status(201).json({
            message: 'Libro insertado con éxito',
            data: libro,
        })
    }

    public async buscarTodos({ response }: HttpContextContract) {
        try {
            const libros = await Libro.query().whereNull('deleted_at')

            return response.status(200).json(libros)
        } catch (error) {
            return response.status(500).json({
                message: 'Error al obtener los libros',
                error: error.message,
            })
        }
    }

    public async buscarPorId({ params, response }: HttpContextContract) {
        try {
            const libro = await Libro.query().whereNull('deleted_at').where('id', params.id).first()

            if (!libro) {
                return response.status(404).json({
                    message: 'Libro no encontrado',
                })
            }

            return response.status(200).json(libro)
        } catch (error) {
            return response.status(500).json({
                message: 'Error al obtener el libro',
                error: error.message,
            })
        }
    }

    public async editarPorId({ params, request, response }: HttpContextContract) {
        const libroSchema = schema.create({
            titulo: schema.string({}, [rules.required()]),
            autor_id: schema.string({}, [rules.required()]),
            editorial_id: schema.number([rules.required()]),
            ano_publicacion: schema.number([rules.range(1000, 9999)])
        })

        const validatedData = await request.validate({ schema: libroSchema })

        try {
            const libro = await Libro.query().whereNull('deleted_at').where('id', params.id).first()

            if (!libro) {
                return response.status(404).json({
                    message: 'Libro no encontrado',
                })
            }

            libro.merge(validatedData)
            await libro.save()

            return response.status(200).json({
                message: 'Libro actualizado con éxito',
                data: libro,
            })
        } catch (error) {
            return response.status(400).json({
                message: 'Error en la validación de datos',
                errors: error.messages,
            })
        }
    }

    public async eliminar({ params, response }: HttpContextContract) {
        const libro = await Libro.find(params.id)

        if (!libro) {
            return response.status(404).json({ message: 'Libro no encontrado' })
        }

        await softDelete(libro)

        return response.status(200).json({ message: 'Libro eliminado' })
    }

    public async restaurar({ params, response }: HttpContextContract) {
        const libro = await Libro.query().whereNotNull('deleted_at').where('id', params.id).first()

        if (!libro) {
            return response.status(404).json({ message: 'Libro no encontrado o no está eliminado' })
        }

        await restore(libro)

        return response.status(200).json({ message: 'Libro restaurado' })
    }
}
