import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { Acl, Role } from '@holoyan/adonisjs-permissions'
import { RoleInterface } from '@holoyan/adonisjs-permissions/types'
import { permissions } from './2_permission_seeder.js'

export default class RolePermissionSeeder extends BaseSeeder {
  async run() {
    const rootAdmin = (await Role.find(1)) as RoleInterface
    await Acl.role(rootAdmin).assignAll(permissions)
  }
}
