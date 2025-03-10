import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { Acl } from '@holoyan/adonisjs-permissions'

export default class UserRoleSeeder extends BaseSeeder {
  async run() {
    const root_admin_user = await User.find(1) as User;
    await Acl.model(root_admin_user).assignAllRoles('root_admin')
  }
}
