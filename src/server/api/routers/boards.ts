import { boardCreateSchema } from 'utils/validation'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

const findAllInput = z.object({ workspaceSlug: z.string() })

export const boardsRouter = createTRPCRouter({
  findAll: protectedProcedure.input(findAllInput).query(({ ctx, input }) => {
    const { user } = ctx.session
    return ctx.prisma.board.findMany({
      where: { workspace: { memberships: { every: { user: { id: user.id } } }, slug: input.workspaceSlug } }
    })
  }),
  create: protectedProcedure.input(boardCreateSchema).mutation(async ({ ctx, input }) => {
    const { user } = ctx.session
    const workspace = await ctx.prisma.workspace.findFirstOrThrow({
      where: { slug: input.workspaceSlug, memberships: { every: { user: { id: user.id } } } }
    })
    return ctx.prisma.board.create({
      data: { name: input.name, slug: input.slug, data: {}, workspace: { connect: { slug: workspace.slug } } }
    })
  })
})
