import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { acceptRouter } from "./routers/accept";
import { userRouter } from "./routers/user";
import { infoRouter } from "./routers/info";
import { fileRouter, imageRouter } from "./routers/files";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  accept: acceptRouter,
  user: userRouter,
  info: infoRouter,
  image: imageRouter,
  file: fileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
