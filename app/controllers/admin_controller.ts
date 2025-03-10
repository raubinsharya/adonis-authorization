import { addRolePermissionValidator } from '#validators/acl/add_role_permissions_validator'
import { createPermissionValidator } from '#validators/acl/create_permission_validator'
import { createRoleValidator } from '#validators/acl/create_role_validator'
import type { HttpContext } from '@adonisjs/core/http'
import { Acl, Permission, Role } from '@holoyan/adonisjs-permissions'
import { RoleInterface } from '@holoyan/adonisjs-permissions/types'

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
  public async getRolePermissions({ request }: HttpContext) {
    const role = await Role.query()
      .where('id', request.param('id'))
      .select('id', 'slug', 'title')
      .first()
    return Acl.role(role as RoleInterface).permissions()
  }
  public async addRolePermissions({ request }: HttpContext) {
    const payload = await request.validateUsing(addRolePermissionValidator)
    const role = (await Acl.role().query().where('slug', payload.role).first()) as RoleInterface
    await Acl.role(role).assignAll(payload.permissions)
    return await Acl.role(role).permissions()
  }
  public async replaceRolePermissions({ request }: HttpContext) {
    const payload = await request.validateUsing(addRolePermissionValidator)
    const role = (await Acl.role().query().where('slug', payload.role).first()) as RoleInterface
    await Acl.role(role).flush()
    await Acl.role(role).assignAll(payload.permissions)
    return await Acl.role(role).permissions()
  }
  public async deleteRolePermissions({ request }: HttpContext) {
    const payload = await request.validateUsing(addRolePermissionValidator)
    const role = (await Acl.role().query().where('slug', payload.role).first()) as RoleInterface
    await Acl.role(role).revokeAllPermissions(payload.permissions)
    return await Acl.role(role).permissions()
  }
  public async createRole({ request }: HttpContext) {
    const payload = await request.validateUsing(createRoleValidator)
    return Acl.role().create(payload)
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

  public async createPermission({ request }: HttpContext) {
    const payload = await request.validateUsing(createPermissionValidator)
    return Acl.permission().create(payload)
  }
}
