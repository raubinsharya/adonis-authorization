import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { Acl, Role } from '@holoyan/adonisjs-permissions'
import { RoleInterface } from '@holoyan/adonisjs-permissions/types'

export default class RolePermissionSeeder extends BaseSeeder {
  async run() {
    // const permissions: Array<string> = ['view_role', 'view_roles']
    // const admin = (await Role.find(2)) as RoleInterface
    // await Acl.role(admin).giveAll(permissions)
    // await this.attachPermission(permissions)
  }

  async attachPermission(permissions: Array<string>) {
    const root_admin = (await Role.find(1)) as RoleInterface
    await Acl.role(root_admin).assignAll(permissions)
  }
}
