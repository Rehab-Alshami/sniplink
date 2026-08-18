import { z } from "zod"

// Only allow http/https URLs so short links can't be used for javascript: or
// data: payloads. The shape/rules live here as the single source of truth;
// messages are passed in so both the client (translated, via useLocale) and
// the server action (English fallback) can localize them independently
// without duplicating the schema itself.
export function createShortenSchema(messages: {
  urlRequired: string
  urlInvalid: string
  urlProtocol: string
  aliasInvalid: string
}) {
  return z.object({
    url: z
      .string()
      .trim()
      .min(1, messages.urlRequired)
      .url(messages.urlInvalid)
      .refine(
        (value) => {
          try {
            const { protocol } = new URL(value)
            return protocol === "http:" || protocol === "https:"
          } catch {
            return false
          }
        },
        { message: messages.urlProtocol },
      ),
    // Optional custom alias: 3-32 chars, letters, numbers, hyphen, underscore.
    customAlias: z
      .string()
      .trim()
      .regex(/^[a-zA-Z0-9_-]{3,32}$/, messages.aliasInvalid)
      .optional()
      .or(z.literal("")),
  })
}

// Default English schema, used by the server action (which validates
// input again regardless of what the client sent) and as a fallback.
export const shortenSchema = createShortenSchema({
  urlRequired: "Please enter a URL",
  urlInvalid: "Enter a valid URL, including http:// or https://",
  urlProtocol: "Only http and https URLs are allowed",
  aliasInvalid: "Alias must be 3-32 characters (letters, numbers, - or _)",
})

export type ShortenInput = z.infer<typeof shortenSchema>
