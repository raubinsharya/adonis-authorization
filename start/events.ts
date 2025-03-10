import SendVerificationEmail from '#listeners/SendVerificationEmail'
import emitter from '@adonisjs/core/services/emitter'

emitter.on('user:registered', [SendVerificationEmail, 'handle'])

