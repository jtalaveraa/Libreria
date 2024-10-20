import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { softDelete, restore } from 'App/Services/SoftDelete'
import Reserva from 'App/Models/Reserva'

export default class ReservasController {

    public async insertar({ request, response }: HttpContextContract) {
        const reservaSchema = schema.create({
            libro_id: schema.number([rules.required()]),
            miembro_id: schema.number([rules.required()]),
            fecha_reserva: schema.date({ format: 'yyyy-MM-dd' }, [rules.required()]),
        })

        const validatedData = await request.validate({ schema: reservaSchema })

        const reserva = await Reserva.create(validatedData)

        return response.status(201).json({
            message: 'Reserva insertada con éxito',
            data: reserva,
        })
    }

    public async buscarTodos({ response }: HttpContextContract) {
        try {
            const reservas = await Reserva.query().whereNull('deleted_at')

            return response.status(200).json(reservas)
        } catch (error) {
            return response.status(500).json({
                message: 'Error al obtener las reservas',
                error: error.message,
            })
        }
    }

    public async buscarPorId({ params, response }: HttpContextContract) {
        try {
            const reserva = await Reserva.query().whereNull('deleted_at').where('id', params.id).first()

            if (!reserva) {
                return response.status(404).json({
                    message: 'Reserva no encontrada',
                })
            }

            return response.status(200).json(reserva)
        } catch (error) {
            return response.status(500).json({
                message: 'Error al obtener la reserva',
                error: error.message,
            })
        }
    }

    public async editarPorId({ params, request, response }: HttpContextContract) {
        const reservaSchema = schema.create({
            libro_id: schema.number([rules.required()]),
            miembro_id: schema.number([rules.required()]),
            fecha_reserva: schema.date({ format: 'yyyy-MM-dd' }, [rules.required()]),
        })

        const validatedData = await request.validate({ schema: reservaSchema })

        try {
            const reserva = await Reserva.query().whereNull('deleted_at').where('id', params.id).first()

            if (!reserva) {
                return response.status(404).json({
                    message: 'Reserva no encontrada',
                })
            }

            reserva.merge(validatedData)
            await reserva.save()

            return response.status(200).json({
                message: 'Reserva actualizada con éxito',
                data: reserva,
            })
        } catch (error) {
            return response.status(400).json({
                message: 'Error en la validación de datos',
                errors: error.messages,
            })
        }
    }

    public async eliminar({ params, response }: HttpContextContract) {
        const reserva = await Reserva.find(params.id)

        if (!reserva) {
            return response.status(404).json({ message: 'Reserva no encontrada' })
        }

        await softDelete(reserva)

        return response.status(200).json({ message: 'Reserva eliminada' })
    }

    public async restaurar({ params, response }: HttpContextContract) {
        const reserva = await Reserva.query().whereNotNull('deleted_at').where('id', params.id).first()

        if (!reserva) {
            return response.status(404).json({ message: 'Reserva no encontrada o no está eliminada' })
        }

        await restore(reserva)

        return response.status(200).json({ message: 'Reserva restaurada' })
    }
}
