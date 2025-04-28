import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class UserSeeder extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        firstName: 'Root',
        lastName: 'Admin',
        status: 'active',
        email: 'root_admin@gmail.com',
        password: '12345678',
      },
      {
        firstName: 'Admin',
        lastName: 'Admin',
        status: 'active',
        email: 'admin@gmail.com',
        password: '12345678',
      },
    ])
  }
}
