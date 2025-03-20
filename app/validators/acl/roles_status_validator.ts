import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

function rootAdminProtector(value: unknown, _: unknown, field: FieldContext) {
  if (Array.isArray(value) && value.some((role) => role.role === 'root_admin'))
    field.report('root_admin cannot be disabled!', 'root_admin', field)
}

export const disableRoleValidator = vine.compile(
  vine.object({
    roles: vine
      .array(
        vine.object({
          role: vine.string(),
          status: vine.boolean(),
        })
      )
      .distinct()
      .notEmpty()
      .use(vine.createRule(rootAdminProtector)()),
  })
)
