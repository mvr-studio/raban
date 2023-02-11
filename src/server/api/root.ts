import { createTRPCRouter } from './trpc'
import { workspacesRouter } from './routers/workspaces'
import { eventsRouter } from './routers/events'
import { appsRouter } from './routers/apps'
import { userRouter } from './routers/user'
import { boardsRouter } from './routers/boards'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  workspaces: workspacesRouter,
  events: eventsRouter,
  apps: appsRouter,
  user: userRouter,
  boards: boardsRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
