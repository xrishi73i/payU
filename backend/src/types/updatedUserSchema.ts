import type { password } from "bun"
import {z} from "zod"
export const updatedUserSchema = z.object({
    firstName :z.string().optional(),
    lastName : z.string().optional(),
    username :z.string().optional(),
    password: z.string().min(8).optional()
})