import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { Role } from '@holoyan/adonisjs-permissions'

export default class RoleSeeder extends BaseSeeder {
  async run() {
    await Role.updateOrCreateMany('id', [
      {
        title: 'root_admin',
        slug: 'root_admin',
        id: '1',
      },
      {
        title: 'admin',
        slug: 'admin',
        id: '2',
      },
    ])
  }
}
