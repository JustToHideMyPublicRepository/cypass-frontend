/**
 * Regex for email validation.
 * Prevents "plus tagging" (e.g. user+tag@gmail.com) as per backend security policy.
 */
export const EMAIL_REGEX = /^[^+]+$/

/**
 * Validates an email string against the security regex.
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || email.trim() === '') return false
  
  // Basic email structure check (fallback for browsers not handling type="email" strictly)
  const basicEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!basicEmail.test(email)) return false

  return EMAIL_REGEX.test(email)
}
