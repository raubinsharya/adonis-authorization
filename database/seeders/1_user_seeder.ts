import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class UserSeeder extends BaseSeeder {
  async run() {
    await User.updateOrCreateMany('id', [
      {
        id: 1,
        firstName: 'Root',
        lastName: 'Admin',
        status: 'active',
        email: 'root_admin@gmail.com',
        password: '12345678',
      },
      {
        id: 2,
        firstName: 'Admin',
        lastName: 'Admin',
        status: 'active',
        email: 'admin@gmail.com',
        password: '12345678',
      },
    ])
  }
}
