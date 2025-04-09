import vine from '@vinejs/vine'

export const userStatusValidator = vine.compile(
  vine.object({
    status: vine.enum(['unauth', 'active', 'deactive', 'block']),
  })
)
