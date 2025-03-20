import vine from '@vinejs/vine'

export const disablePermissionsValidator = vine.compile(
  vine.object({
    permissions: vine
      .array(
        vine.object({
          permission: vine.string(),
          status: vine.boolean(),
        })
      )
      .distinct()
      .notEmpty(),
  })
)
