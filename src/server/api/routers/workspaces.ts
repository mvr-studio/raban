import { workspaceCreateSchema } from 'utils/validation'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

const findOneInput = z.object({ slug: z.string() })

export const workspacesRouter = createTRPCRouter({
  findAll: protectedProcedure.query(({ ctx }) => {
    const { user } = ctx.session
    return ctx.prisma.workspace.findMany({
      where: { memberships: { every: { user: { id: user.id } } } }
    })
  }),
  findAllSlugs: protectedProcedure.query(async ({ ctx }) => {
    const workspaces = await ctx.prisma.workspace.findMany({ select: { slug: true } })
    return workspaces.map((workspace) => workspace.slug)
  }),
  findOne: protectedProcedure.input(findOneInput).query(({ ctx, input }) => {
    const { user } = ctx.session
    return ctx.prisma.workspace.findFirstOrThrow({
      where: { slug: input.slug, memberships: { every: { user: { id: user.id } } } },
      include: { applications: true }
    })
  }),
  create: protectedProcedure.input(workspaceCreateSchema).mutation(({ ctx, input }) => {
    const { user } = ctx.session
    return ctx.prisma.workspace.create({
      data: {
        ...input,
        memberships: {
          create: {
            user: {
              connect: {
                id: user.id
              }
            }
          }
        }
      }
    })
  })
})
