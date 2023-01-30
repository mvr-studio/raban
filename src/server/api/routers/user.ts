import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

const settingsInput = z.object({
  settings: z.object({ workspaceSlug: z.string().optional(), appSlug: z.string().optional() })
})

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(({ ctx }) => {
    const { user } = ctx.session
    return ctx.prisma.user.findUnique({ where: { id: user.id } })
  }),
  getSettings: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx.session
    const dbUser = await ctx.prisma.user.findUnique({ where: { id: user.id } })
    return dbUser?.settings && JSON.parse(dbUser?.settings)
  }),
  setSettings: protectedProcedure.input(settingsInput).mutation(async ({ ctx, input }) => {
    const { user } = ctx.session
    const dbUser = await ctx.prisma.user.findUnique({ where: { id: user.id } })
    const settings = dbUser?.settings && JSON.parse(dbUser?.settings)
    const mergedSettings = JSON.stringify({ ...settings, ...input.settings })
    return ctx.prisma.user.update({ data: { settings: mergedSettings }, where: { id: user.id } })
  })
})
