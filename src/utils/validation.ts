import { z } from 'zod'

const workspaceSlug = z.string().min(3).max(24)

export const workspaceCreateSchema = z.object({
  name: z.string().min(3).max(24),
  slug: workspaceSlug
})

export const appCreateSchema = z.object({
  name: z.string().min(3).max(24),
  slug: z.string().min(3).max(24),
  workspaceSlug
})

export const boardCreateSchema = z.object({
  name: z.string().min(2).max(24),
  slug: z.string().min(2).max(24),
  workspaceSlug
})
