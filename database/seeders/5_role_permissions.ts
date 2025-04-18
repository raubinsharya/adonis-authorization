import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { permissions } from './2_permission_seeder.js'
import Role from '../../packages/src/models/role.js'
import { RoleInterface } from '../../packages/src/types.js'
import { Acl } from '../../packages/src/acl.js'

export default class RolePermissionSeeder extends BaseSeeder {
  async run() {
    const rootAdmin = (await Role.find(1)) as RoleInterface
    await Acl.role(rootAdmin).assignAll(permissions)
  }
}
