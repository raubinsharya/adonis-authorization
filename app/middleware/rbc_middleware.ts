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

    // roles
    if (Array.isArray(options.roles) && options.roles.length > 0) {
      const hasAllRoles = await ctx.auth.user!.hasAllRoles(...options.roles)
      const isActive = (await ctx.auth.user.roles()).every((role) => !!role.allowed)
      if (!hasAllRoles || !isActive) return ctx.response.forbidden(forbiddenError)
    }
    // permissions
    if (Array.isArray(options.permissions) && options.permissions.length > 0) {
      const hasAllPermissions = await ctx.auth.user!.hasAllPermissions(options.permissions)
      if (!hasAllPermissions) return ctx.response.forbidden(forbiddenError)
    }

    const output = await next()
    return output
  }
}
