// Alphanumeric alphabet without easily-confused characters (0/O, 1/l/I).
const ALPHABET = "23456789abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"

export function generateShortCode(length = 7): string {
  let code = ""
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  for (let i = 0; i < length; i++) {
    code += ALPHABET[bytes[i] % ALPHABET.length]
  }
  return code
}

// Reserved paths that must never be used as short codes so they don't shadow
// real application routes.
export const RESERVED_CODES = new Set([
  "dashboard",
  "login",
  "api",
  "_next",
  "favicon.ico",
])
