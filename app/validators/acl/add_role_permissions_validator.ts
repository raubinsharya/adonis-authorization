import vine from '@vinejs/vine'
import { arrayExists } from '../rules/array_exists.js'

export const addRolePermissionValidator = vine.compile(
  vine.object({
    permissions: vine
      .array(vine.string())
      .minLength(1)
      .use(arrayExists({ column: 'slug', table: 'permissions' })),
  })
)
