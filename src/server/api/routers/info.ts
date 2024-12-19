import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const infoRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.info.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
  }),
  getLatest: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.info.findMany({
      orderBy: {
        created_at: "desc",
      },
      take: 8,
    });
  }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.info.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        body: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.admin) return null;
      return await ctx.db.info.create({
        data: {
          body: input.body,
          title: input.title,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        body: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.admin) return null;

      return await ctx.db.info.update({
        where: { id: input.id },
        data: {
          body: input.body,
          title: input.title,
          updated_at: new Date(),
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.admin) return null;
      return await ctx.db.info.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
