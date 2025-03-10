import User from '#models/user'

export default class SendVerificationEmail {
  handle(user: User) {
    console.info('here we go', user.email)
  }
}
