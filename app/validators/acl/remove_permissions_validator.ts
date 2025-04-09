import { arrayExists } from '#validators/rules/array_exists'
import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

function permissionsProtector(value: unknown, _: unknown, field: FieldContext) {
  if (Array.isArray(value) && value.some((elem) => elem === 'root_admin'))
    field.report('root_permission cannot be removed', 'permissions', field)
}

export const removePermissionsValidator = vine.compile(
  vine.object({
    permissions: vine
      .array(vine.string())
      .distinct()
      .notEmpty()
      .use(arrayExists({ table: 'permissions', column: 'slug' }))
      .use(vine.createRule(permissionsProtector)()),
  })
)
