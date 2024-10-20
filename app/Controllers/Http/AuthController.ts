import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User' 
import Hash from '@ioc:Adonis/Core/Hash'

export default class AuthController {
    // Login para obtener el token
    public async login({ request, auth, response }: HttpContextContract) {
        const { email, password } = request.only(['email', 'password'])


        const user = await User.query().where('email', email).first()
        
        if (!user) {
            return response.status(400).json({ message: 'Credenciales inválidas' })
        }
        
        /*
        if (!(await Hash.verify(user.password, password))) {
            return response.status(400).json({ message: 'Contraseña incorrecta' })
        } */

        // API
        const token = await auth.use('api').generate(user, {
            expiresIn: '15days' 
        })

        return response.status(200).json({
            message: 'Inicio de sesion exitoso',
            token: token.token 
        })
    } F

}
