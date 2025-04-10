import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

function permissionProtector(value: unknown, _: unknown, field: FieldContext) {
  if (Array.isArray(value) && value.some((elem) => elem.permission === 'root_admin'))
    field.report('root_admin status cannot be changed', 'permissions', field)
}

export const disablePermissionsValidator = vine.compile(
  vine.object({
    permissions: vine
      .array(
        vine.object({
          permission: vine.string(),
          status: vine.boolean(),
        })
      )
      .use(vine.createRule(permissionProtector)())
      .distinct()
      .notEmpty(),
  })
)
