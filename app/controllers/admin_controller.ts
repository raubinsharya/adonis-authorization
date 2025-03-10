import User from '#models/user'
import { addRolePermissionValidator } from '#validators/acl/add_role_permissions_validator'
import { createPermissionValidator } from '#validators/acl/create_permission_validator'
import { createRoleValidator } from '#validators/acl/create_roles_validator'
import { deletePermissionsValidator } from '#validators/acl/delete_permissions_validator'
import { deleteRoleValidator } from '#validators/acl/delete_roles_validator'
import type { HttpContext } from '@adonisjs/core/http'
import { Acl, Permission, Role } from '@holoyan/adonisjs-permissions'
import { AclModel, RoleInterface } from '@holoyan/adonisjs-permissions/types'

export default class AdminController {
  public async getAllRole({}: HttpContext) {
    const roles = await Role.query().select('id', 'slug', 'title')
    return roles
  }
  public async getRole({ request }: HttpContext) {
    const role = await Role.query()
      .where('id', request.param('id'))
      .select('id', 'slug', 'title')
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
      .where('slug', request.param('id'))
      .first()) as RoleInterface
    if (!role) return response.json({ errors: [{ message: 'Role Not Found!' }] })
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

  public async getAllPermissions({}: HttpContext) {
    const roles = await Permission.query().select('id', 'slug', 'title')
    return roles
  }
  public async getPermission({ request }: HttpContext) {
    const role = await Permission.query()
      .where('id', request.param('id'))
      .select('id', 'slug', 'title')
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
    return await Permission.query().select(['slug', 'title'])
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
    const payload = await request.validateUsing(deletePermissionsValidator)
    const user = (await User.find(request.param('id'))) as AclModel
    if (!user) return response.json({ errors: [{ message: 'User Not Found!' }] })
    return await Acl.model(user).assignDirectAllPermissions(payload.permissions)
  }

  public async updateUserPermissions({ request, response }: HttpContext) {
    const payload = await request.validateUsing(deletePermissionsValidator)
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
    const payload = await request.validateUsing(deletePermissionsValidator)
    const user = (await User.find(request.param('id'))) as AclModel
    if (!user) return response.json({ errors: [{ message: 'User Not Found!' }] })
    await Acl.model(user).revokeAllPermissions(payload.permissions)
    return await Acl.model(user).permissions()
  }
}
