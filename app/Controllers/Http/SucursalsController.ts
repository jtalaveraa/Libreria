import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { softDelete, restore } from 'App/Services/SoftDelete'
import Sucursal from 'App/Models/Sucursal'

export default class SucursalsController {
    public async insertar({ request, response }: HttpContextContract) {
        const sucursalSchema = schema.create({
            nombre: schema.string({}, [rules.required()]),
            ubicacion: schema.string({}, [rules.maxLength(255)])
        })

        const validatedData = await request.validate({ schema: sucursalSchema })

        const sucursal = await Sucursal.create(validatedData)

        return response.status(201).json({
            message: 'Sucursal insertada con éxito',
            data: sucursal
        })
    }


    public async buscarTodos({ response }: HttpContextContract) {
        try {
            const sucursales = await Sucursal.query().whereNull('deleted_at')

            return response.status(200).json(sucursales)
        } catch (error) {
            return response.status(500).json({
                message: 'Error al obtener las sucursales',
                error: error.message
            })
        }
    }


    public async buscarPorId({ params, response }: HttpContextContract) {
        try {
            const sucursal = await Sucursal.query().whereNull('deleted_at').where('id', params.id).first()

            if (!sucursal) {
                return response.status(404).json({
                    message: 'Sucursal no encontrada'
                })
            }

            return response.status(200).json(sucursal)
        } catch (error) {
            return response.status(500).json({
                message: 'Error al obtener la sucursal',
                error: error.message
            })
        }
    }


    public async editarPorId({ params, request, response }: HttpContextContract) {
        const sucursalSchema = schema.create({
            nombre: schema.string({}, [rules.maxLength(255)]),
            ubicacion: schema.string({}, [rules.maxLength(255)])
        })

        const validatedData = await request.validate({ schema: sucursalSchema })

        try {
            const sucursal = await Sucursal.query().whereNull('deleted_at').where('id', params.id).first()

            if (!sucursal) {
                return response.status(404).json({
                    message: 'Sucursal no encontrada'
                })
            }

            sucursal.merge(validatedData)
            await sucursal.save()

            return response.status(200).json({
                message: 'Sucursal actualizada con éxito',
                data: sucursal
            })
        } catch (error) {
            return response.status(400).json({
                message: 'Error en la validación de datos',
                errors: error.messages
            })
        }
    }


    public async eliminar({ params, response }: HttpContextContract) {
        const sucursal = await Sucursal.find(params.id)

        if (!sucursal) {
            return response.status(404).json({ message: 'Sucursal no encontrada' })
        }

        await softDelete(sucursal)

        return response.status(200).json({ message: 'Sucursal eliminada' })
    }

    public async restaurar({ params, response }: HttpContextContract) {
        const sucursal = await Sucursal.query().whereNotNull('deleted_at').where('id', params.id).first()

        if (!sucursal) {
            return response.status(404).json({ message: 'Sucursal no encontrada o no está eliminada' })
        }

        await restore(sucursal)

        return response.status(200).json({ message: 'Sucursal restaurada' })
    }
}
