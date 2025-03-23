import {z} from "zod";
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string().default("secret"),
  JWT_EXPIRES_IN: z.string().default("1d"),
  BASE_API_URL:z.string().url(),
  INSTANCE:z.string(),
  URL_SEND_MESSAGE_WHATSAPP:z.string(),
  APIKEY:z.string(),
})

export const env = envSchema.parse(process.env);