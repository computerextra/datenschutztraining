import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user) return null;

    const res = await ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
    return res;
  }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.admin) return null;

    const res = await ctx.db.user.findMany();
    return { res };
  }),
  update: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user) return null;

      const res = await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
        },
      });

      return res;
    }),
  updateAdmin: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        admin: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.admin) return null;

      const res = await ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          admin: input.admin,
        },
      });
      return res;
    }),
  delete: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session.user) return null;

    const res = await ctx.db.user.delete({
      where: { id: ctx.session.user.id },
    });
    return res;
  }),
  deleteAdmin: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.admin) return null;

      const res = await ctx.db.user.delete({
        where: { id: input.id },
      });
      return res;
    }),
});
