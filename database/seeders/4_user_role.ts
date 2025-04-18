import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { Acl } from '../../packages/src/acl.js'

export default class UserRoleSeeder extends BaseSeeder {
  async run() {
    const rootAdminUser = (await User.find(1)) as User
    await Acl.model(rootAdminUser).assignAllRoles('root_admin')
  }
}
