import { z } from "zod"

// Common validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)]{10,}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  URL: /^https?:\/\/.+/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  ALPHABETIC: /^[a-zA-Z\s]+$/,
  NUMERIC: /^\d+$/,
  DECIMAL: /^\d+(\.\d{1,2})?$/,
  DATE: /^\d{4}-\d{2}-\d{2}$/,
  TIME: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
  ZIP_CODE: /^\d{5}(-\d{4})?$/,
  CREDIT_CARD: /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/,
  SSN: /^\d{3}-?\d{2}-?\d{4}$/,
} as const

// Common validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  EMAIL: "Please enter a valid email address",
  PHONE: "Please enter a valid phone number",
  PASSWORD: "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
  URL: "Please enter a valid URL",
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must be no more than ${max} characters`,
  MIN_VALUE: (min: number) => `Must be at least ${min}`,
  MAX_VALUE: (max: number) => `Must be no more than ${max}`,
  PATTERN: "Please enter a valid value",
  CONFIRM_PASSWORD: "Passwords do not match",
  FUTURE_DATE: "Date must be in the future",
  PAST_DATE: "Date must be in the past",
  AGE_MIN: (min: number) => `Must be at least ${min} years old`,
  AGE_MAX: (max: number) => `Must be no more than ${max} years old`,
} as const

// Common Zod schemas
export const COMMON_SCHEMAS = {
  EMAIL: z.string().email(VALIDATION_MESSAGES.EMAIL),
  PHONE: z.string().regex(VALIDATION_PATTERNS.PHONE, VALIDATION_MESSAGES.PHONE),
  PASSWORD: z.string().regex(VALIDATION_PATTERNS.PASSWORD, VALIDATION_MESSAGES.PASSWORD),
  URL: z.string().url(VALIDATION_MESSAGES.URL),
  ALPHANUMERIC: z.string().regex(VALIDATION_PATTERNS.ALPHANUMERIC, "Must contain only letters and numbers"),
  ALPHABETIC: z.string().regex(VALIDATION_PATTERNS.ALPHABETIC, "Must contain only letters"),
  NUMERIC: z.string().regex(VALIDATION_PATTERNS.NUMERIC, "Must contain only numbers"),
  DECIMAL: z.string().regex(VALIDATION_PATTERNS.DECIMAL, "Must be a valid decimal number"),
  DATE: z.string().regex(VALIDATION_PATTERNS.DATE, "Must be a valid date (YYYY-MM-DD)"),
  TIME: z.string().regex(VALIDATION_PATTERNS.TIME, "Must be a valid time (HH:MM)"),
  ZIP_CODE: z.string().regex(VALIDATION_PATTERNS.ZIP_CODE, "Must be a valid ZIP code"),
  CREDIT_CARD: z.string().regex(VALIDATION_PATTERNS.CREDIT_CARD, "Must be a valid credit card number"),
  SSN: z.string().regex(VALIDATION_PATTERNS.SSN, "Must be a valid SSN"),
} as const

// Validation helper functions
export const validationHelpers = {
  // Check if value is required
  isRequired: (value: unknown): boolean => {
    if (typeof value === "string") return value.trim().length > 0
    if (Array.isArray(value)) return value.length > 0
    return value !== null && value !== undefined
  },

  // Check if email is valid
  isValidEmail: (email: string): boolean => {
    return VALIDATION_PATTERNS.EMAIL.test(email)
  },

  // Check if phone is valid
  isValidPhone: (phone: string): boolean => {
    return VALIDATION_PATTERNS.PHONE.test(phone)
  },

  // Check if password meets requirements
  isValidPassword: (password: string): boolean => {
    return VALIDATION_PATTERNS.PASSWORD.test(password)
  },

  // Check if URL is valid
  isValidUrl: (url: string): boolean => {
    return VALIDATION_PATTERNS.URL.test(url)
  },

  // Check if date is in the future
  isFutureDate: (date: string | Date): boolean => {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj > new Date()
  },

  // Check if date is in the past
  isPastDate: (date: string | Date): boolean => {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj < new Date()
  },

  // Calculate age from date of birth
  calculateAge: (dateOfBirth: string | Date): number => {
    const dob = typeof dateOfBirth === "string" ? new Date(dateOfBirth) : dateOfBirth
    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }
    
    return age
  },

  // Check if age meets minimum requirement
  isMinimumAge: (dateOfBirth: string | Date, minAge: number): boolean => {
    return validationHelpers.calculateAge(dateOfBirth) >= minAge
  },

  // Check if age meets maximum requirement
  isMaximumAge: (dateOfBirth: string | Date, maxAge: number): boolean => {
    return validationHelpers.calculateAge(dateOfBirth) <= maxAge
  },

  // Check if passwords match
  doPasswordsMatch: (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword
  },

  // Check if value is within length limits
  isWithinLength: (value: string, min: number, max: number): boolean => {
    return value.length >= min && value.length <= max
  },

  // Check if value is within numeric limits
  isWithinRange: (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max
  },

  // Check if value matches pattern
  matchesPattern: (value: string, pattern: RegExp): boolean => {
    return pattern.test(value)
  },

  // Sanitize input (remove dangerous characters)
  sanitizeInput: (input: string): string => {
    return input
      .replace(/[<>]/g, "") // Remove < and >
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/on\w+=/gi, "") // Remove event handlers
      .trim()
  },

  // Validate file size
  isValidFileSize: (file: File, maxSizeInMB: number): boolean => {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024
    return file.size <= maxSizeInBytes
  },

  // Validate file type
  isValidFileType: (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(file.type)
  },

  // Validate image dimensions
  isValidImageDimensions: (
    file: File,
    maxWidth: number,
    maxHeight: number
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        resolve(img.width <= maxWidth && img.height <= maxHeight)
      }
      img.onerror = () => resolve(false)
      img.src = URL.createObjectURL(file)
    })
  },
} as const

// React Hook Form validation rules generator
export const createValidationRules = {
  required: (message?: string) => ({
    required: message || VALIDATION_MESSAGES.REQUIRED,
  }),

  email: (message?: string) => ({
    pattern: {
      value: VALIDATION_PATTERNS.EMAIL,
      message: message || VALIDATION_MESSAGES.EMAIL,
    },
  }),

  phone: (message?: string) => ({
    pattern: {
      value: VALIDATION_PATTERNS.PHONE,
      message: message || VALIDATION_MESSAGES.PHONE,
    },
  }),

  password: (message?: string) => ({
    pattern: {
      value: VALIDATION_PATTERNS.PASSWORD,
      message: message || VALIDATION_MESSAGES.PASSWORD,
    },
  }),

  url: (message?: string) => ({
    pattern: {
      value: VALIDATION_PATTERNS.URL,
      message: message || VALIDATION_MESSAGES.URL,
    },
  }),

  minLength: (min: number, message?: string) => ({
    minLength: {
      value: min,
      message: message || VALIDATION_MESSAGES.MIN_LENGTH(min),
    },
  }),

  maxLength: (max: number, message?: string) => ({
    maxLength: {
      value: max,
      message: message || VALIDATION_MESSAGES.MAX_LENGTH(max),
    },
  }),

  min: (min: number, message?: string) => ({
    min: {
      value: min,
      message: message || VALIDATION_MESSAGES.MIN_VALUE(min),
    },
  }),

  max: (max: number, message?: string) => ({
    max: {
      value: max,
      message: message || VALIDATION_MESSAGES.MAX_VALUE(max),
    },
  }),

  pattern: (pattern: RegExp, message?: string) => ({
    pattern: {
      value: pattern,
      message: message || VALIDATION_MESSAGES.PATTERN,
    },
  }),

  custom: (validate: (value: unknown) => string | true) => ({
    validate,
  }),

  // Combine multiple rules
  combine: (...rules: Record<string, unknown>[]) => {
    return rules.reduce((acc, rule) => ({ ...acc, ...rule }), {})
  },
} as const

// Common form validation schemas
export const formSchemas = {
  // User registration schema
  userRegistration: z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: COMMON_SCHEMAS.EMAIL,
    password: COMMON_SCHEMAS.PASSWORD,
    confirmPassword: z.string(),
    phone: COMMON_SCHEMAS.PHONE.optional(),
    dateOfBirth: z.string().refine(
      (date) => validationHelpers.isMinimumAge(date, 13),
      "Must be at least 13 years old"
    ),
    acceptTerms: z.boolean().refine((val) => val === true, "Must accept terms and conditions"),
  }).refine(
    (data) => validationHelpers.doPasswordsMatch(data.password, data.confirmPassword),
    {
      message: VALIDATION_MESSAGES.CONFIRM_PASSWORD,
      path: ["confirmPassword"],
    }
  ),

  // User profile schema
  userProfile: z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: COMMON_SCHEMAS.EMAIL,
    phone: COMMON_SCHEMAS.PHONE.optional(),
    bio: z.string().max(500, "Bio must be no more than 500 characters").optional(),
    website: COMMON_SCHEMAS.URL.optional(),
    location: z.string().max(100, "Location must be no more than 100 characters").optional(),
  }),

  // Contact form schema
  contactForm: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: COMMON_SCHEMAS.EMAIL,
    subject: z.string().min(5, "Subject must be at least 5 characters"),
    message: z.string().min(10, "Message must be at least 10 characters"),
  }),

  // Address schema
  address: z.object({
    street: z.string().min(5, "Street address must be at least 5 characters"),
    city: z.string().min(2, "City must be at least 2 characters"),
    state: z.string().min(2, "State must be at least 2 characters"),
    zipCode: COMMON_SCHEMAS.ZIP_CODE,
    country: z.string().min(2, "Country must be at least 2 characters"),
  }),

  // Payment form schema
  paymentForm: z.object({
    cardNumber: COMMON_SCHEMAS.CREDIT_CARD,
    cardholderName: z.string().min(2, "Cardholder name must be at least 2 characters"),
    expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, "Invalid expiry month"),
    expiryYear: z.string().regex(/^(20[2-9][0-9]|2[1-9][0-9][0-9])$/, "Invalid expiry year"),
    cvv: z.string().regex(/^[0-9]{3,4}$/, "Invalid CVV"),
  }),
} as const

// Type exports
export type UserRegistrationForm = z.infer<typeof formSchemas.userRegistration>
export type UserProfileForm = z.infer<typeof formSchemas.userProfile>
export type ContactForm = z.infer<typeof formSchemas.contactForm>
export type AddressForm = z.infer<typeof formSchemas.address>
export type PaymentForm = z.infer<typeof formSchemas.paymentForm> 