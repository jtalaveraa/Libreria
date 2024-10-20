import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { softDelete, restore } from 'App/Services/SoftDelete'
import Editorial from 'App/Models/Editorial'

export default class EditorialesController {

    public async insertar({ request, response }: HttpContextContract) {
        const editorialSchema = schema.create({
            nombre: schema.string({}, [rules.required()]),
            direccion : schema.string()
        })
        
        const validatedData = await request.validate({ schema: editorialSchema })
        
        const editorial = await Editorial.create(validatedData)
        
        return response.status(201).json({
            message: 'Editorial insertada con éxito',
            data: editorial
        })
    }
    
    public async buscarTodos({ response }: HttpContextContract) {
        try {
            const editorial = await Editorial.query().whereNull('deleted_at')

            return response.status(200).json(editorial)
        }
        catch (error) {
            return response.status(500).json({
                message: 'Error al obtener a las editoriales',
                error: error.message
            })
        }

    }


    public async buscarPorId({ params, response }: HttpContextContract) {
        try {
            const editorial = await Editorial.query().whereNull('deleted_at').where('id', params.id).first()

            if (!editorial) {
                return response.status(404).json({
                    message: 'Editoriales no encontrada'
                })
            }

            return response.status(200).json(editorial)
        } catch (error) {
            return response.status(500).json({
                message: 'Error al obtener la editorial',
                error: error.message
            })
        }
    }


    public async editarPorId({ params, request, response }: HttpContextContract) {
        const editorialSchema = schema.create({
            nombre: schema.string({}, [rules.maxLength(255)]),
            direccion: schema.string()
            
        })

        const validatedData = await request.validate({ schema: editorialSchema })

        try {
            const editorial = await Editorial.query().whereNull('deletedAt').where('id', params.id).first()

            if (!editorial) {
                return response.status(404).json({
                    message: 'Editorial no encontrada'
                })
            }

            editorial.merge(validatedData)
            await editorial.save()

            return response.status(200).json({
                message: 'Editorial actualizada con éxito',
                data: editorial
            })
        } catch (error) {
            return response.status(400).json({
                message: 'Error en la validación de datos',
                errors: error.messages
            })
        }
    }


    public async eliminar({ params, response }: HttpContextContract) {
        const editorial = await Editorial.find(params.id)

        if (!editorial) {
            return response.status(404).json({ message: 'Editorial no encontrada' })
        }

        await softDelete(editorial)

        return response.status(200).json({ message: 'Editorial eliminada' })
    }

    public async restaurar({ params, response }: HttpContextContract) {
        const editorial = await Editorial.query().whereNotNull('deleted_at').where('id', params.id).first()

        if (!editorial) {
            return response.status(404).json({ message: 'Editorial no encontrada o no está eliminada' })
        }

        await restore(editorial)

        return response.status(200).json({ message: 'Editorial restaurada' })
    }
}
