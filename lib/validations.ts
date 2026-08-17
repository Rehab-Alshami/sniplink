import { z } from "zod"

// Only allow http/https URLs so short links can't be used for javascript: or
// data: payloads.
export const shortenSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "Please enter a URL")
    .url("Enter a valid URL, including http:// or https://")
    .refine(
      (value) => {
        try {
          const { protocol } = new URL(value)
          return protocol === "http:" || protocol === "https:"
        } catch {
          return false
        }
      },
      { message: "Only http and https URLs are allowed" },
    ),
  // Optional custom alias: 3-32 chars, letters, numbers, hyphen, underscore.
  customAlias: z
    .string()
    .trim()
    .regex(
      /^[a-zA-Z0-9_-]{3,32}$/,
      "Alias must be 3-32 characters (letters, numbers, - or _)",
    )
    .optional()
    .or(z.literal("")),
})

export type ShortenInput = z.infer<typeof shortenSchema>
