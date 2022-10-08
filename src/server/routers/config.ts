import { z } from "zod";
import { t } from "../trpc";

export const clientRouter = t.router({
  currentId: t.procedure
    .input(z.object({ collection: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.session) {
        console.log(input.collection);
        return { id: 0 };
      } else return { id: null };
    }),
});
