export function isAuthConfigured() {
  return Boolean(process.env.NEXT_AUTH_SECRET && process.env.JWT_SECRET)
}
