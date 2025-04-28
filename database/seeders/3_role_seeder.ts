import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '../../packages/src/models/role.js'

export default class RoleSeeder extends BaseSeeder {
  async run() {
    await Role.updateOrCreateMany('slug', [
      {
        title: 'root_admin',
        slug: 'root_admin',
      },
      {
        title: 'admin',
        slug: 'admin',
      },
    ])
  }
}
