import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { softDelete, restore } from 'App/Services/SoftDelete'
import Bibliotecario from 'App/Models/Bibliotecario'

export default class BibliotecariosController {
    public async insertar({ request, response }: HttpContextContract) {
        const categoriaSchema = schema.create({
            nombre: schema.string({}, [rules.required()]),
            sucursal_id: schema.bigint()
        })

        const validatedData = await request.validate({ schema: categoriaSchema })

        const bibliotecario = await Bibliotecario.create(validatedData)

        return response.status(201).json({
            message: 'Bibliotecario insertado con éxito',
            data: bibliotecario
        })
    }


    public async buscarTodos({ response }: HttpContextContract) {
        try {
            const bibliotecario = await Bibliotecario.query().whereNull('deleted_at')

            return response.status(200).json(bibliotecario)
        }
        catch (error) {
            return response.status(500).json({
                message: 'Error al obtener a los bibliotecarios',
                error: error.message
            })
        }

    }


    public async buscarPorId({ params, response }: HttpContextContract) {
        try {
            const bibliotecario = await Bibliotecario.query().whereNull('deleted_at').where('id', params.id).first()

            if (!bibliotecario) {
                return response.status(404).json({
                    message: 'Bibliotecario no encontrado'
                })
            }

            return response.status(200).json(bibliotecario)
        } catch (error) {
            return response.status(500).json({
                message: 'Error al obtener el bibliotecario',
                error: error.message
            })
        }
    }


    public async editarPorId({ params, request, response }: HttpContextContract) {
        const bibliotecarioSchema = schema.create({
            nombre: schema.string({}, [rules.maxLength(255)]),
            sucursal_id: schema.bigint()
            
        })

        const validatedData = await request.validate({ schema: bibliotecarioSchema })

        try {
            const bibliotecario = await Bibliotecario.query().whereNull('deletedAt').where('id', params.id).first()

            if (!bibliotecario) {
                return response.status(404).json({
                    message: 'Bibliotecario no encontrado'
                })
            }

            bibliotecario.merge(validatedData)
            await bibliotecario.save()

            return response.status(200).json({
                message: 'Bibliotecario actualizado con éxito',
                data: bibliotecario
            })
        } catch (error) {
            return response.status(400).json({
                message: 'Error en la validación de datos',
                errors: error.messages
            })
        }
    }


    public async eliminar({ params, response }: HttpContextContract) {
        const bibliotecario = await Bibliotecario.find(params.id)

        if (!bibliotecario) {
            return response.status(404).json({ message: 'Bibliotecario no encontrado' })
        }

        await softDelete(bibliotecario)

        return response.status(200).json({ message: 'Bibliotecario eliminado' })
    }

    public async restaurar({ params, response }: HttpContextContract) {
        const bibliotecario = await Bibliotecario.query().whereNotNull('deleted_at').where('id', params.id).first()

        if (!bibliotecario) {
            return response.status(404).json({ message: 'Bibliotecario no encontrado o no está eliminado' })
        }

        await restore(bibliotecario)

        return response.status(200).json({ message: 'Bibliotecario restaurado' })
    }
}
