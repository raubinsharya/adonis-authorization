import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    userName: vine.string(),
    password: vine.string().minLength(6).maxLength(24)
  })
)
