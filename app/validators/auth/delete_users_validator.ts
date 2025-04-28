import { arrayExists } from '#validators/rules/array_exists'
import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

function rootUserProtector(value: unknown, _: unknown, field: FieldContext) {
  if (Array.isArray(value) && value.some((elem) => elem === 1))
    field.report('Root User cannot be deleted', 'root_user', field)
}

export const deleteUsersValidator = vine.compile(
  vine.object({
    userIds: vine
      .array(vine.number())
      .use(arrayExists({ column: 'id', table: 'users' }))
      .use(vine.createRule(rootUserProtector)()),
  })
)
