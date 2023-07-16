import { z } from "zod";
export const todoSchema = z.object({
  title: z.string().min(1, { message: "title is required" }),
  description: z.string().min(2, { message: "description is required" }),
  isActive: z.boolean().optional().default(false),
});

export type Todo = z.infer<typeof todoSchema>;
