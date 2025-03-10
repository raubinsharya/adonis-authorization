import { arrayExists } from '#validators/rules/array_exists'
import vine from '@vinejs/vine'

export const deletePermissionsValidator = vine.compile(
  vine.object({
    permissions: vine
      .array(vine.string())
      .distinct()
      .notEmpty()
      .use(arrayExists({ table: 'permissions', column: 'slug' })),
  })
)
