import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const todoInput = z.object({
  title: z.string(),
  description: z.string(),
  isActive: z.boolean(),
});
export const todoRouter = createTRPCRouter({
  create: publicProcedure.input(todoInput).mutation(({ ctx, input }) => {
    return ctx.prisma.todo.create({
      data: {
        description: input.description,
        title: input.title,
        isActive: input.isActive,
      },
    });
  }),

  update: publicProcedure
    .input(
      todoInput.merge(
        z.object({ id: z.string().uuid({ message: "UUID is required" }) })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.findUnique({
        where: { id: input.id },
      });
      if (!todo) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Todo not found" });
      }
      const { id, ...rest } = input;
      return ctx.prisma.todo.update({ where: { id }, data: rest });
    }),

  get: publicProcedure.query(({ ctx }) => {
    // const res = ctx.prisma.todo.findMany({ where: { isActive: true } });
    const res = ctx.prisma.todo.findMany({ orderBy: { createdAt: "desc" } });
    return res;
  }),

  delete: publicProcedure
    .input(z.object({ Id: z.string().uuid({ message: "UUID is required" }) }))
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.findUnique({
        where: { id: input.Id },
      });
      if (!todo) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Todo not found" });
      }
      return ctx.prisma.todo.delete({ where: { id: input.Id } });
    }),
});
