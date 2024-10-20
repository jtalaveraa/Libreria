import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { softDelete, restore } from 'App/Services/SoftDelete'
import Miembro from 'App/Models/Miembro'

export default class MiembrosController {
    public async insertar({ request, response }: HttpContextContract) {
        const miembroSchema = schema.create({
            nombre: schema.string({}, [rules.required()]),
            correo_electronico: schema.string({}, [rules.maxLength(255)]),
            fecha_ingreso : schema.date.optional({ format: 'yyyy-MM-dd' })
        })

        const validatedData = await request.validate({ schema: miembroSchema })

        const miembros = await Miembro.create(validatedData)

        return response.status(201).json({
            message: 'Miembro insertado con éxito',
            data: miembros
        })
    }


    public async buscarTodos({ response }: HttpContextContract) {
        try {
            const miembros = await Miembro.query().whereNull('deleted_at')

            return response.status(200).json(miembros)
        } catch (error) {
            return response.status(500).json({
                message: 'Error al obtener los miembros de la base de datos',
                error: error.message
            })
        }
    }


    public async buscarPorId({ params, response }: HttpContextContract) {
        try {
            const miembros = await Miembro.query().whereNull('deleted_at').where('id', params.id).first()

            if (!miembros) {
                return response.status(404).json({
                    message: 'Miembro no encontrado'
                })
            }

            return response.status(200).json(miembros)
        } catch (error) {
            return response.status(500).json({
                message: 'Error al obtener al miembro',
                error: error.message
            })
        }
    }


    public async editarPorId({ params, request, response }: HttpContextContract) {
        const miembroSchema = schema.create({
            nombre: schema.string({}, [rules.required()]),
            correo_electronico: schema.string({}, [rules.maxLength(255)]),
            fecha_ingreso : schema.date.optional({ format: 'yyyy-MM-dd' }) 
        })

        const validatedData = await request.validate({ schema: miembroSchema })

        try {
            const miembros = await Miembro.query().whereNull('deleted_at').where('id', params.id).first()

            if (!miembros) {
                return response.status(404).json({
                    message: 'Miembro no encontrado'
                })
            }

            miembros.merge(validatedData)
            await miembros.save()

            return response.status(200).json({
                message: 'Miembro actualizado con éxito',
                data: miembros
            })
        } catch (error) {
            return response.status(400).json({
                message: 'Error en la validación de datos',
                errors: error.messages
            })
        }
    }


    public async eliminar({ params, response }: HttpContextContract) {
        const miembros = await Miembro.find(params.id)

        if (!miembros) {
            return response.status(404).json({ message: 'Miembro no encontrado' })
        }

        await softDelete(miembros)

        return response.status(200).json({ message: 'Miembro eliminado' })
    }

    public async restaurar({ params, response }: HttpContextContract) {
        const miembros = await Miembro.query().whereNotNull('deleted_at').where('id', params.id).first()

        if (!miembros) {
            return response.status(404).json({ message: 'Miembro no encontrado o no está eliminado' })
        }

        await restore(miembros)

        return response.status(200).json({ message: 'Miembro restaurado' })
    }
}
