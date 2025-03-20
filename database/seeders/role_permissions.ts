import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { Acl, Role } from '@holoyan/adonisjs-permissions'
import { RoleInterface } from '@holoyan/adonisjs-permissions/types'

export default class RolePermissionSeeder extends BaseSeeder {
  async run() {
    const permissions: Array<string> = [
      'view_roles',
      'view_role',
      'add_role_permissions',
      'create_roles',
      'delete_roles',
      'disable_roles',
      'view_permissions',
      'view_permission',
      'create_permissions',
      'delete_permissions',
      'disable_permissions',
      'view_users',
      'view_user',
      'view_user_roles',
      'add_user_roles',
      'update_user_roles',
      'add_user_permissions',
      'update_user_permissions',
      'delete_user_roles',
      'delete_user_permissions',
    ]
    await this.attachPermission(permissions)
  }

  async attachPermission(permissions: Array<string>) {
    const root_admin = (await Role.find(1)) as RoleInterface
    await Acl.role(root_admin).assignAll(permissions)
  }
}
