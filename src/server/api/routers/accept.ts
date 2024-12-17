import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const acceptRouter = createTRPCRouter({
  check: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db.accept.findUnique({
        where: {
          id: input.id,
        },
      });
      return { res };
    }),
});
