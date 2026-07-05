import type { password } from "bun"
import {z} from "zod"
export const signupSchema = z.object({
    firstName :z.string(),
    lastName : z.string(),
    username  :z.email(),
    password : z.string().min(8)
})