import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const AufgabenRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.aufgabe.findMany({
      orderBy: {
        created_at: "desc",
      },
      include: {
        questions: true,
      },
    });
  }),
  getAllDoneAdmin: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.admin) return null;
    return await ctx.db.aufgabe.findMany({
      include: {
        completed_by: true,
      },
    });
  }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.aufgabe.findUnique({
        where: {
          id: input.id,
        },
        include: {
          questions: {
            include: {
              anwers: true,
            },
          },
        },
      });
    }),
  getByUser: protectedProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      let id = "";
      if (input.id) id = input.id;
      else id = ctx.session.user.id;

      return await ctx.db.aufgabe.findMany({
        where: {
          completed_by: {
            some: {
              userId: id,
            },
          },
        },
        include: {
          completed_by: {
            orderBy: { created_at: "desc" },
          },
        },
      });
    }),
  getUndone: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.aufgabe.findMany({
      include: {
        questions: true,
      },
      where: {
        NOT: {
          completed_by: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
      },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        body: z.string(),
        questions: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.admin) return null;
      return await ctx.db.aufgabe.create({
        data: {
          title: input.title,
          body: input.body,
          questions: {
            connect: input.questions.map((x) => ({
              id: x,
            })),
          },
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        body: z.string(),
        questions: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.admin) return null;

      return await ctx.db.aufgabe.update({
        where: { id: input.id },
        data: {
          title: input.title,
          body: input.body,
          updated_at: new Date(),
          questions: {
            set: input.questions.map((x) => ({
              id: x,
            })),
          },
        },
      });
    }),
  markDone: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.aufgabe.update({
        where: {
          id: input.id,
        },
        data: {
          completed_by: {
            create: {
              userId: ctx.session.user.id,
            },
          },
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.admin) return null;
      return await ctx.db.aufgabe.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
