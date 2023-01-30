import { z } from 'zod'

export const workspaceCreateSchema = z.object({
  name: z.string().min(3).max(24),
  slug: z.string().min(3).max(24)
})

export const appCreateSchema = z.object({
  name: z.string().min(3).max(24),
  slug: z.string().min(3).max(24),
  workspaceSlug: z.string().min(3).max(24)
})
