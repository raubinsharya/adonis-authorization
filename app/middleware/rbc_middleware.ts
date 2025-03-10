import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { AclManager } from '@holoyan/adonisjs-permissions'
import { forbiddenError, unauthError } from '../../constant/response.js'

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    acl: AclManager
  }
}

export default class UserScopeMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: { permissions?: Array<string>; roles?: Array<string> } = {}
  ) {
    if (!ctx.auth?.user) return ctx.response.unauthorized(unauthError)
    if (await ctx.auth?.user?.hasRole('root_admin')) return await next()

    if (Array.isArray(options.roles) && options.roles.length > 0) {
      const hasAllRoles = await ctx.auth.user!.hasAllRoles(...options.roles)
      if (!hasAllRoles) return ctx.response.forbidden(forbiddenError)
    }
    if (Array.isArray(options.permissions) && options.permissions.length > 0) {
      const hasAllPermissions = await ctx.auth.user!.hasAllPermissions(options.permissions)
      if (!hasAllPermissions) return ctx.response.forbidden(forbiddenError)
    }

    const output = await next()
    return output
  }
}
