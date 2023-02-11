import { appCreateSchema } from 'utils/validation'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

const findOneInput = z.object({ appSlug: z.string() })

export const appsRouter = createTRPCRouter({
  findAll: protectedProcedure.query(({ ctx }) => {
    const { user } = ctx.session
    return ctx.prisma.application.findMany({
      where: { workspace: { memberships: { every: { user: { id: user.id } } } } }
    })
  }),
  findOne: protectedProcedure.input(findOneInput).query(async ({ ctx, input }) => {
    const { user } = ctx.session
    return ctx.prisma.application.findFirstOrThrow({
      where: { slug: input.appSlug, workspace: { memberships: { every: { user: { id: user.id } } } } }
    })
  }),
  create: protectedProcedure.input(appCreateSchema).mutation(async ({ ctx, input }) => {
    const { user } = ctx.session
    const workspace = await ctx.prisma.workspace.findFirstOrThrow({
      where: { slug: input.workspaceSlug, memberships: { every: { user: { id: user.id } } } }
    })
    return ctx.prisma.application.create({
      data: { name: input.name, slug: input.slug, workspace: { connect: { slug: workspace.slug } } }
    })
  })
})
