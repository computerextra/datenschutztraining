import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const FragenRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.question.findMany({
      orderBy: {
        created_at: "desc",
      },
      include: {
        anwers: true,
      },
    });
  }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.question.findUnique({
        where: {
          id: input.id,
        },
        include: {
          anwers: true,
        },
      });
    }),
  getAllFromAufgabe: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.question.findMany({
        where: {
          aufgabeId: input.id,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        question: z.string(),
        antworten: z.array(z.string()),
        type: z.enum(["FREE", "MULTI", "ONE"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.admin) return null;
      return await ctx.db.question.create({
        data: {
          title: input.title,
          question: input.question,
          answer_type: input.type,
          anwers: {
            connect: input.antworten.map((x) => ({
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
        question: z.string(),
        antworten: z.array(z.string()),
        type: z.enum(["FREE", "MULTI", "ONE"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.admin) return null;

      return await ctx.db.question.update({
        where: { id: input.id },
        data: {
          title: input.title,
          question: input.question,
          answer_type: input.type,
          updated_at: new Date(),
          anwers: {
            set: input.antworten.map((x) => ({
              id: x,
            })),
          },
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.admin) return null;
      return await ctx.db.question.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
