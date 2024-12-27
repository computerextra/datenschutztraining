import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const zertifikatRouter = createTRPCRouter({
  delete: protectedProcedure
    .input(z.object({ userId: z.string(), aufgabeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.admin) return null;

      return await ctx.db.aufgabeOnUser.deleteMany({
        where: {
          AND: [
            {
              userId: input.userId,
            },
            {
              aufgabeId: input.aufgabeId,
            },
          ],
        },
      });
    }),
});
