import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Permission from '../../packages/src/models/permission.js'

export const permissions: Array<string> = [
  'root_admin',
  'view_roles',
  'view_role',
  'add_role_permissions',
  'create_roles',
  'delete_roles',
  'update_roles_status',
  'view_permissions',
  'view_permission',
  'create_permissions',
  'delete_permissions',
  'update_permissions_status',
  'view_users',
  'view_user',
  'view_user_roles',
  'add_user_roles',
  'update_user_roles',
  'add_user_permissions',
  'update_user_permissions',
  'delete_user_roles',
  'delete_user_permissions',
  'remove_role_permissions',
  'update_user_status',
  'view_role_permissions',
  'view_user_permissions',
  'create_user',
  'delete_users',
]

export default class PermissionSeeder extends BaseSeeder {
  async run() {
    await Permission.updateOrCreateMany(
      'slug',
      permissions.map((permission) => ({
        title: permission,
        slug: permission,
      }))
    )
  }
}
