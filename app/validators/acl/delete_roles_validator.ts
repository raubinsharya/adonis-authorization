import { arrayExists } from '#validators/rules/array_exists'
import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

function rootAdminProtector(value: unknown, _: unknown, field: FieldContext) {
  if (Array.isArray(value) && value.includes('root_admin'))
    field.report('root_admin cannot be deleted!', 'root_admin', field)
}

export const deleteRoleValidator = vine.compile(
  vine.object({
    roles: vine
      .array(vine.string())
      .distinct()
      .notEmpty()
      .use(arrayExists({ table: 'roles', column: 'slug' }))
      .use(vine.createRule(rootAdminProtector)()),
  })
)
