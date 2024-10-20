import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { softDelete, restore } from 'App/Services/SoftDelete'
import Prestamo from 'App/Models/Prestamo'

export default class PrestamosController {

    public async insertar({ request, response }: HttpContextContract) {
        const prestamoSchema = schema.create({
            libro_id: schema.number([rules.required()]),
            miembro_id: schema.number([rules.required()]),
            fecha_prestamo: schema.date({ format: 'yyyy-MM-dd' }),
            fecha_devolucion: schema.date.optional({ format: 'yyyy-MM-dd' })
        })

        const validatedData = await request.validate({ schema: prestamoSchema })

        const prestamo = await Prestamo.create(validatedData)

        return response.status(201).json({
            message: 'Préstamo insertado con éxito',
            data: prestamo,
        })
    }

    public async buscarTodos({ response }: HttpContextContract) {
        try {
            const prestamos = await Prestamo.query().whereNull('deleted_at')

            return response.status(200).json(prestamos)
        } catch (error) {
            return response.status(500).json({
                message: 'Error al obtener los préstamos',
                error: error.message,
            })
        }
    }

    public async buscarPorId({ params, response }: HttpContextContract) {
        try {
            const prestamo = await Prestamo.query().whereNull('deleted_at').where('id', params.id).first()

            if (!prestamo) {
                return response.status(404).json({
                    message: 'Préstamo no encontrado',
                })
            }

            return response.status(200).json(prestamo)
        } catch (error) {
            return response.status(500).json({
                message: 'Error al obtener el préstamo',
                error: error.message,
            })
        }
    }

    public async editarPorId({ params, request, response }: HttpContextContract) {
        const prestamoSchema = schema.create({
            libro_id: schema.number([rules.required()]),
            miembro_id: schema.number([rules.required()]),
            fecha_prestamo: schema.date({ format: 'yyyy-MM-dd' }),
            fecha_devolucion: schema.date.optional({ format: 'yyyy-MM-dd' })
        })

        const validatedData = await request.validate({ schema: prestamoSchema })

        try {
            const prestamo = await Prestamo.query().whereNull('deleted_at').where('id', params.id).first()

            if (!prestamo) {
                return response.status(404).json({
                    message: 'Préstamo no encontrado',
                })
            }

            prestamo.merge(validatedData)
            await prestamo.save()

            return response.status(200).json({
                message: 'Préstamo actualizado con éxito',
                data: prestamo,
            })
        } catch (error) {
            return response.status(400).json({
                message: 'Error en la validación de datos',
                errors: error.messages,
            })
        }
    }

    public async eliminar({ params, response }: HttpContextContract) {
        const prestamo = await Prestamo.find(params.id)

        if (!prestamo) {
            return response.status(404).json({ message: 'Préstamo no encontrado' })
        }

        await softDelete(prestamo)

        return response.status(200).json({ message: 'Préstamo eliminado' })
    }

    public async restaurar({ params, response }: HttpContextContract) {
        const prestamo = await Prestamo.query().whereNotNull('deleted_at').where('id', params.id).first()

        if (!prestamo) {
            return response.status(404).json({ message: 'Préstamo no encontrado o no está eliminado' })
        }

        await restore(prestamo)

        return response.status(200).json({ message: 'Préstamo restaurado' })
    }
}
