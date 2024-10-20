import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Categoria from 'App/Models/Categoria'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { softDelete, restore} from 'App/Services/SoftDelete'


export default class CategoriasController {

    
    public async insertar({ request, response }: HttpContextContract) {
        const categoriaSchema = schema.create({
            nombre: schema.string({}, [rules.required()]),
        })

        const validatedData = await request.validate({ schema: categoriaSchema })

        const categoria = await Categoria.create(validatedData)

        return response.status(201).json({
            message: 'Categoria insertada con éxito',
            data: categoria
        })
    }

    
    public async buscarTodos({response} : HttpContextContract) {
        try {
        const categorias = await Categoria.query().whereNull('deleted_at')

        return response.status(200).json(categorias)
        }
        catch(error){
            return response.status(500).json({
                message: 'Error al obtener las categorias',
                error: error.message
            })
        }
        
    }

    
    public async buscarPorId({ params, response }: HttpContextContract) {
        try {
            const categoria = await Categoria.query().whereNull('deleted_at').where('id', params.id).first()

            if (!categoria) {
                return response.status(404).json({
                    message: 'Categoria no encontrada'
                })
            }

            return response.status(200).json(categoria)
        } catch (error) {
            return response.status(500).json({
                message: 'Error al obtener la categoria',
                error: error.message
            })
        }
    }


    public async editarPorId({ params, request, response }: HttpContextContract) {
        const categoriaSchema = schema.create({
            nombre: schema.string({}, [rules.maxLength(255)])
        })

        const validatedData = await request.validate({ schema: categoriaSchema })

        try {
            const categoria = await Categoria.query().whereNull('deletedAt').where('id', params.id).first()

            if (!categoria) {
                return response.status(404).json({
                    message: 'Autor no encontrado'
                })
            }

            categoria.merge(validatedData)
            await categoria.save()

            return response.status(200).json({
                message: 'Categoria actualizada con éxito',
                data: categoria
            })
        } catch (error) {
            return response.status(400).json({
                message: 'Error en la validación de datos',
                errors: error.messages
            })
        }
    }

    
    public async eliminar({ params, response }: HttpContextContract) {
        const categoria = await Categoria.find(params.id)

        if (!categoria) {
            return response.status(404).json({ message: 'Categoria no encontrada' })
        }
        
        await softDelete(categoria)

        return response.status(200).json({ message: 'Categoria eliminada' })
    }

    public async restaurar({ params, response }: HttpContextContract) {
        const categoria = await Categoria.query().whereNotNull('deleted_at').where('id', params.id).first()

        if (!categoria) {
            return response.status(404).json({ message: 'Categoria no encontrada o no está eliminado' })
        }

        await restore(categoria)

        return response.status(200).json({ message: 'Categoria restaurada' })
    }
}
