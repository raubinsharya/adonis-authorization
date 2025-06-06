import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { forbiddenError, unauthError } from '../../constant/response.js'
import { AclManager } from '../../packages/src/acl.js'

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    acl: AclManager
  }
}

type MiddlewareOptions = {
  anyRoles?: string[]
  allRoles?: string[]
  exceptRoles?: string[]
  anyPermissions?: string[]
  allPermissions?: string[]
  exceptPermissions?: string[]
}

export default class UserScopeMiddleware {
  async handle(ctx: HttpContext, next: NextFn, options: MiddlewareOptions = {}) {
    const user = ctx.auth?.user
    if (!user) return ctx.response.unauthorized(unauthError)

    if ((await user.hasRole('root_admin')) || (await user.hasPermission('root_admin')))
      return await next()

    // EXCEPT ROLES
    if (options.exceptRoles?.length) {
      const hasAnyExcludedRole = await user.hasAnyRole(...options.exceptRoles)
      if (hasAnyExcludedRole) return ctx.response.forbidden(forbiddenError)
    }

    // ANY ROLES
    if (options.anyRoles?.length) {
      const hasAnyRole = await user.hasAnyRole(...options.anyRoles)
      if (!hasAnyRole) return ctx.response.forbidden(forbiddenError)
    }

    // ALL ROLES
    if (options.allRoles?.length) {
      const hasAllRoles = await user.hasAllRoles(...options.allRoles)
      if (!hasAllRoles) return ctx.response.forbidden(forbiddenError)
    }

    // EXCEPT PERMISSIONS
    if (options.exceptPermissions?.length) {
      const hasAnyExcludedPermission = await user.hasAnyPermission(options.exceptPermissions)
      if (hasAnyExcludedPermission) return ctx.response.forbidden(forbiddenError)
    }

    // ANY PERMISSIONS
    if (options.anyPermissions?.length) {
      const hasAnyPerm = await user.hasAnyPermission(options.anyPermissions)
      if (!hasAnyPerm) return ctx.response.forbidden(forbiddenError)
    }

    // ALL PERMISSIONS
    if (options.allPermissions?.length) {
      const hasAllPerms = await user.hasAllPermissions(options.allPermissions)
      if (!hasAllPerms) return ctx.response.forbidden(forbiddenError)
    }

    return await next()
  }
}
