import vine from '@vinejs/vine'
import { arrayExists } from '../rules/array_exists.js'
import { FieldContext } from '@vinejs/vine/types'

function permissionProtector(value: unknown, _: unknown, field: FieldContext) {
  if (Array.isArray(value) && value.some((elem) => elem === 'root_admin'))
    field.report('root_admin cannot be proceed!', 'permissions', field)
}

export const addRolePermissionValidator = vine.compile(
  vine.object({
    permissions: vine
      .array(vine.string())
      .minLength(1)
      .use(arrayExists({ column: 'slug', table: 'permissions' }))
      .use(vine.createRule(permissionProtector)()),
  })
)
