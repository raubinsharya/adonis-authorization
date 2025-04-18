import User from '#models/user'
import { addRolePermissionValidator } from '#validators/acl/add_role_permissions_validator'
import { createPermissionValidator } from '#validators/acl/create_permission_validator'
import { createRoleValidator } from '#validators/acl/create_roles_validator'
import { deletePermissionsValidator } from '#validators/acl/delete_permissions_validator'
import { deleteRoleValidator } from '#validators/acl/delete_roles_validator'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { disableRoleValidator } from '#validators/acl/roles_status_validator'
import { disablePermissionsValidator } from '#validators/acl/permissions_status_validator'
import { userStatusValidator } from '#validators/acl/user_status_validator'
import { removePermissionsValidator } from '#validators/acl/remove_permissions_validator'
import Role from '../../packages/src/models/role.js'
import { AclModel, RoleInterface } from '../../packages/src/types.js'
import { Acl } from '../../packages/src/acl.js'
import Permission from '../../packages/src/models/permission.js'
export default class AdminController {
  public async getAllRole() {
    const roles = await Role.query()
      .select('id', 'slug', 'title', 'allowed', 'scope')
      .whereNot('id', 1)
    return roles
  }
  public async getRole({ request }: HttpContext) {
    const role = await Role.query()
      .where('id', request.param('id'))
      .select('id', 'slug', 'title', 'allowed')
      .first()
    return role
  }
  public async getRolePermissions({ request, response }: HttpContext) {
    const role = await Role.query()
      .where('id', request.param('id'))
      .select('id', 'slug', 'title')
      .first()
    if (!role) return response.json({ errors: [{ message: 'Role Not Found!' }] })
    return Acl.role(role as RoleInterface).permissions()
  }
  public async addRolePermissions({ request, response }: HttpContext) {
    const payload = await request.validateUsing(addRolePermissionValidator)
    const role = (await Role.query().where('id', request.param('id')).first()) as RoleInterface
    if (!role) return response.json({ errors: [{ message: 'Role Not Found!' }] })
    await Acl.role(role).assignAll(payload.permissions)
    return await Acl.role(role).permissions()
  }
  public async replaceRolePermissions({ request, response }: HttpContext) {
    const payload = await request.validateUsing(addRolePermissionValidator)
    const role = (await Acl.role()
      .query()
      .where('id', request.param('id'))
      .first()) as RoleInterface
    if (!role) return response.json({ errors: [{ message: 'Role Not Found!' }] })
    await Acl.role(role).sync(payload.permissions)
    return await Acl.role(role).permissions()
  }
  public async deleteRolePermissions({ request, response }: HttpContext) {
    const payload = await request.validateUsing(addRolePermissionValidator)
    const role = (await Acl.role()
      .query()
      .where('id', request.param('id'))
      .first()) as RoleInterface
    if (!role) return response.status(404).json({ errors: [{ message: 'Role Not Found!' }] })
    await Acl.role(role).revokeAllPermissions(payload.permissions)
    return await Acl.role(role).permissions()
  }
  public async createRoles({ request }: HttpContext) {
    const payload = await request.validateUsing(createRoleValidator)
    return Role.fetchOrCreateMany('slug', payload.roles)
  }
  public async deleteRoles({ request }: HttpContext) {
    const payload = await request.validateUsing(deleteRoleValidator)
    await Role.query().delete().whereIn('slug', payload.roles)
    return await Role.query().select(['slug', 'title'])
  }

  public async disableRoles({ request }: HttpContext) {
    const { roles } = await request.validateUsing(disableRoleValidator)
    await db.rawQuery(`
      UPDATE roles AS r
      SET allowed = u.allowed
      FROM (VALUES ${roles.map((r) => `('${r.role}', ${r.status})`).join(', ')}) AS u(slug, allowed)
      WHERE r.slug = u.slug
    `)
    return await Role.query().whereNot('id', 1)
  }

  public async getAllPermissions() {
    const roles = await Permission.query()
      .select('id', 'slug', 'title', 'scope', 'allowed')
      .whereNot('id', 1)
    return roles
  }
  public async getPermission({ request }: HttpContext) {
    const role = await Permission.query()
      .where('id', request.param('id'))
      .select('id', 'slug', 'title', 'scope', 'allowed')
      .first()
    return role
  }

  public async createPermissions({ request }: HttpContext) {
    const payload = await request.validateUsing(createPermissionValidator)
    return Permission.fetchOrCreateMany('slug', payload.permissions)
  }
  public async deletePermissions({ request }: HttpContext) {
    const payload = await request.validateUsing(deletePermissionsValidator)
    await Permission.query().delete().whereIn('slug', payload.permissions)
    return await Permission.query()
  }

  public async disablePermissions({ request }: HttpContext) {
    const { permissions } = await request.validateUsing(disablePermissionsValidator)
    await db.rawQuery(`
      UPDATE permissions AS r
      SET allowed = u.allowed
      FROM (VALUES ${permissions.map((r) => `('${r.permission}', ${r.status})`).join(', ')}) AS u(slug, allowed)
      WHERE r.slug = u.slug
    `)
    return await Permission.query().whereNot('id', 1)
  }

  public async getUsers() {
    return await User.all()
  }
  public async getUser({ request }: HttpContext) {
    return await User.find(request.param('id'))
  }
  public async getUserRoles({ request, response }: HttpContext) {
    const user = (await User.find(request.param('id'))) as AclModel
    if (!user) return response.json({ errors: [{ message: 'User Not Found!' }] })
    return Acl.model(user).roles()
  }
  public async getUserPermissions({ request, response }: HttpContext) {
    const user = (await User.find(request.param('id'))) as AclModel
    if (!user) return response.json({ errors: [{ message: 'User Not Found!' }] })
    return Acl.model(user).permissions()
  }
  public async addUserRoles({ request, response }: HttpContext) {
    const payload = await request.validateUsing(deleteRoleValidator)
    const user = (await User.find(request.param('id'))) as AclModel
    if (!user) return response.json({ errors: [{ message: 'User Not Found!' }] })
    await Acl.model(user).assignAllRoles(...payload.roles)
    return await Acl.model(user).roles()
  }
  public async updateUserRoles({ request, response }: HttpContext) {
    const payload = await request.validateUsing(deleteRoleValidator)
    const user = (await User.find(request.param('id'))) as AclModel
    if (!user) return response.json({ errors: [{ message: 'User Not Found!' }] })
    await Acl.model(user).syncRoles(payload.roles)
    return await Acl.model(user).roles()
  }
  public async addUserPermissions({ request, response }: HttpContext) {
    const payload = await request.validateUsing(removePermissionsValidator)
    const user = (await User.find(request.param('id'))) as AclModel
    if (!user) return response.json({ errors: [{ message: 'User Not Found!' }] })
    return await Acl.model(user).assignDirectAllPermissions(payload.permissions)
  }

  public async updateUserPermissions({ request, response }: HttpContext) {
    const payload = await request.validateUsing(removePermissionsValidator)
    const user = (await User.find(request.param('id'))) as AclModel
    if (!user) return response.json({ errors: [{ message: 'User Not Found!' }] })
    await Acl.model(user).syncPermissions(payload.permissions)
    return await Acl.model(user).permissions()
  }
  public async deleteUserRoles({ request, response }: HttpContext) {
    const payload = await request.validateUsing(deleteRoleValidator)
    const user = (await User.find(request.param('id'))) as AclModel
    if (!user) return response.json({ errors: [{ message: 'User Not Found!' }] })
    await Acl.model(user).revokeAllRoles(...payload.roles)
    return await Acl.model(user).roles()
  }
  public async deleteUserPermissions({ request, response }: HttpContext) {
    const payload = await request.validateUsing(removePermissionsValidator)
    const user = (await User.find(request.param('id'))) as AclModel
    if (!user) return response.json({ errors: [{ message: 'User Not Found!' }] })
    await Acl.model(user).revokeAllPermissions(payload.permissions)
    return await Acl.model(user).permissions()
  }
  public async updateUserStatus({ request, response }: HttpContext) {
    const { status } = await request.validateUsing(userStatusValidator)
    const user: User = await User.query()
      .where('id', request.param('id'))
      .update('status', status)
      .whereNot('id', 1)
      .first()
    await db
      .from('auth_access_tokens')
      .where('tokenable_id', request.param('id'))
      .whereNot('tokenable_id', 1)
      .delete()
    if (!user) return response.json({ errors: [{ message: 'User Not Found!' }] })
    return user
  }
}
