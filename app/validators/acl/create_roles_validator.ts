import vine from '@vinejs/vine'

export const createRoleValidator = vine.compile(
  vine.object({
    roles: vine
      .array(
        vine.object({
          slug: vine.string(),
          title: vine.string().optional(),
        })
      )
      .notEmpty(),
  })
)
