import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { AclManager, Scope } from '@holoyan/adonisjs-permissions'

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    acl: AclManager
  }
}

export default class UserScopeMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
  ) {
    const scope = new Scope()
    ctx.acl = new AclManager(true).scope(scope)

    const output = await next()
    return output
  }
}
