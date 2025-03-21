import {z} from "zod";
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string().default("secret"),
  JWT_EXPIRES_IN: z.string().default("1d"),
})