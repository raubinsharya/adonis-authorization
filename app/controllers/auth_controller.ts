import User from '#models/user'
import { loginValidator } from '#validators/auth/login_validator'
import { signupValidator } from '#validators/auth/signup_validator'
import type { HttpContext } from '@adonisjs/core/http'
import emitter from '@adonisjs/core/services/emitter'

export default class AuthController {
  public async create({ request, response }: HttpContext) {
    const { email } = request.only(['email'])
    const payload = await request.validateUsing(signupValidator, {
      meta: {
        email,
      },
    })
    const user = await User.updateOrCreate({ email: payload.email }, payload)
    response.json({ message: 'User registration sucessful! verification email is sent' })
    emitter.emit('user:registered', user)
  }
  public async login({ request }: HttpContext) {
    const payload = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(payload.userName, payload.password)
    if(user.status === 'unauth') return {
        errors: [
            {
                message: 'Account Not verified!'
            }
        ]
    }
    if(user.status !== 'active') return {
        errors: [
            {
                message: 'Something Wrong with account, please contact admin!'
            }
        ]
    }
    const token = await User.accessTokens.create(user, ['*'], { expiresIn: '24hr' })
    return {
      token: token.value!.release(),
    }
  }
}
