import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'
import { compress } from 'shrink-string'
import dayjs from 'dayjs'

const findOneInput = z.object({ appSlug: z.string() })
const createInput = z.object({
  stateSlug: z.string(),
  appSlug: z.string(),
  metadata: z.string(),
  context: z.string().optional()
})

export const eventsRouter = createTRPCRouter({
  findAll: protectedProcedure.input(findOneInput).query(async ({ ctx, input }) => {
    const { user } = ctx.session
    const application = await ctx.prisma.application.findFirstOrThrow({
      where: { slug: input.appSlug, workspace: { memberships: { every: { user: { id: user.id } } } } },
      include: { events: { include: { state: true } } }
    })
    return application.events
  }),
  chartData: protectedProcedure.input(findOneInput).query(async ({ ctx, input }) => {
    const { user } = ctx.session
    const application = await ctx.prisma.application.findFirstOrThrow({
      where: {
        slug: input.appSlug,
        createdAt: { gt: dayjs().subtract(7, 'days').toISOString() },
        workspace: { memberships: { every: { user: { id: user.id } } } }
      },
      include: { events: true }
    })
    return application.events
  }),
  create: publicProcedure.input(createInput).mutation(async ({ ctx, input }) => {
    const compressedMeta = await compress(input.metadata)
    return ctx.prisma.event.create({
      data: {
        metadata: input.metadata,
        context: input.context,
        compressedMeta,
        state: {
          connect: {
            slug: input.stateSlug
          }
        },
        application: {
          connect: {
            slug: input.appSlug
          }
        }
      }
    })
  })
})
