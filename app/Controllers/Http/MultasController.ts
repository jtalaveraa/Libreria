import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { softDelete, restore } from 'App/Services/SoftDelete'
import Multa from 'App/Models/Multa'

export default class MultasController {
    public async insertar({ request, response }: HttpContextContract) {
        const multaSchema = schema.create({
            monto: schema.number([rules.required()]),
            pagado: schema.boolean([rules.required()]),
            miembro_id: schema.number([rules.required()]),
        })

        const validatedData = await request.validate({ schema: multaSchema })

        const multa = await Multa.create(validatedData)

        return response.status(201).json({
            message: 'Multa insertada con éxito',
            data: multa
        })
    }

    public async buscarTodos({ response }: HttpContextContract) {
        try {
            const multas = await Multa.query().whereNull('deleted_at')

            return response.status(200).json(multas)
        } catch (error) {
            return response.status(500).json({
                message: 'Error al obtener las multas',
                error: error.message
            })
        }
    }

    public async buscarPorId({ params, response }: HttpContextContract) {
        try {
            const multa = await Multa.query().whereNull('deleted_at').where('id', params.id).first()

            if (!multa) {
                return response.status(404).json({
                    message: 'Multa no encontrada'
                })
            }

            return response.status(200).json(multa)
        } catch (error) {
            return response.status(500).json({
                message: 'Error al obtener la multa',
                error: error.message
            })
        }
    }

    public async editarPorId({ params, request, response }: HttpContextContract) {
        const multaSchema = schema.create({
            monto: schema.number([rules.required()]),
            pagado: schema.boolean([rules.required()]),
            miembro_id: schema.number([rules.required()]),
        })

        const validatedData = await request.validate({ schema: multaSchema })

        try {
            const multa = await Multa.query().whereNull('deleted_at').where('id', params.id).first()

            if (!multa) {
                return response.status(404).json({
                    message: 'Multa no encontrada'
                })
            }

            multa.merge(validatedData)
            await multa.save()

            return response.status(200).json({
                message: 'Multa actualizada con éxito',
                data: multa
            })
        } catch (error) {
            return response.status(400).json({
                message: 'Error en la validación de datos',
                errors: error.messages
            })
        }
    }

    public async eliminar({ params, response }: HttpContextContract) {
        const multa = await Multa.find(params.id)

        if (!multa) {
            return response.status(404).json({ message: 'Multa no encontrada' })
        }

        await softDelete(multa)

        return response.status(200).json({ message: 'Multa eliminada' })
    }

    public async restaurar({ params, response }: HttpContextContract) {
        const multa = await Multa.query().whereNotNull('deleted_at').where('id', params.id).first()

        if (!multa) {
            return response.status(404).json({ message: 'Multa no encontrada o no está eliminada' })
        }

        await restore(multa)

        return response.status(200).json({ message: 'Multa restaurada' })
    }
}
