/**
 * Universal Input Sanitizer
 * Sanitizes all types of user input to prevent XSS, injection attacks, and server crashes
 * Can be used across the entire project for all input fields
 */

/**
 * Sanitizes plain text input by removing dangerous characters and patterns
 * @param input - The text input to sanitize
 * @param options - Sanitization options
 * @returns Sanitized text
 */
export function sanitizeText(
  input: string, 
  options: {
    maxLength?: number;
    allowHTML?: boolean;
    removeScripts?: boolean;
    removeSQL?: boolean;
    trimWhitespace?: boolean;
  } = {}
): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  const {
    maxLength = 10000,
    allowHTML = false,
    removeScripts = true,
    removeSQL = true,
    trimWhitespace = true
  } = options;

  let sanitized = input;

  // Trim whitespace if requested
  if (trimWhitespace) {
    sanitized = sanitized.trim();
  }

  // Remove or escape dangerous characters
  if (removeScripts) {
    // Remove script tags and content
    sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');
    sanitized = sanitized.replace(/<script[^>]*>/gi, '');
    
    // Remove javascript: protocols
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/vbscript:/gi, '');
    sanitized = sanitized.replace(/data:/gi, '');
    
    // Remove event handlers
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=\s*[^"'\s>]+/gi, '');
  }

  if (removeSQL) {
    // Remove SQL injection patterns
    sanitized = sanitized.replace(/('|(\\')|(;)|(\-\-)|(\/\*)|(\*\/))/gi, '');
    sanitized = sanitized.replace(/(union|select|insert|update|delete|drop|create|alter|exec|execute)/gi, '');
  }

  // Remove dangerous HTML tags if HTML is not allowed
  if (!allowHTML) {
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  }

  // Remove control characters
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Sanitizes email input
 * @param email - Email string to sanitize
 * @returns Sanitized email
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    return '';
  }

  // Basic email sanitization
  let sanitized = email.trim().toLowerCase();
  
  // Remove dangerous characters
  sanitized = sanitized.replace(/[<>'"&]/g, '');
  
  // Remove script patterns
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/vbscript:/gi, '');
  
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return '';
  }

  return sanitized;
}

/**
 * Sanitizes phone number input
 * @param phone - Phone number string to sanitize
 * @returns Sanitized phone number
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') {
    return '';
  }

  // Remove all non-digit characters except +, -, (, ), and spaces
  let sanitized = phone.replace(/[^\d+\-\(\)\s]/g, '');
  
  // Remove multiple spaces
  sanitized = sanitized.replace(/\s+/g, ' ').trim();
  
  // Remove script patterns
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/vbscript:/gi, '');
  
  return sanitized;
}

/**
 * Sanitizes URL input
 * @param url - URL string to sanitize
 * @returns Sanitized URL
 */
export function sanitizeURL(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  let sanitized = url.trim();
  
  // Remove dangerous protocols
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/vbscript:/gi, '');
  sanitized = sanitized.replace(/data:/gi, '');
  
  // Remove script patterns
  sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');
  sanitized = sanitized.replace(/<script[^>]*>/gi, '');
  
  // Basic URL validation
  try {
    const urlObj = new URL(sanitized);
    if (!['http:', 'https:', 'mailto:'].includes(urlObj.protocol)) {
      return '';
    }
    return sanitized;
  } catch {
    return '';
  }
}

/**
 * Sanitizes numeric input
 * @param input - Numeric string to sanitize
 * @param options - Options for numeric sanitization
 * @returns Sanitized number as string
 */
export function sanitizeNumber(
  input: string, 
  options: {
    allowDecimals?: boolean;
    allowNegative?: boolean;
    maxValue?: number;
    minValue?: number;
  } = {}
): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  const {
    allowDecimals = true,
    allowNegative = true,
    maxValue = Number.MAX_SAFE_INTEGER,
    minValue = Number.MIN_SAFE_INTEGER
  } = options;

  // Remove all non-numeric characters except decimal point and minus
  let sanitized = input.replace(/[^\d.-]/g, '');
  
  // Remove multiple decimal points
  const decimalCount = (sanitized.match(/\./g) || []).length;
  if (decimalCount > 1) {
    const firstDecimal = sanitized.indexOf('.');
    sanitized = sanitized.substring(0, firstDecimal + 1) + 
                sanitized.substring(firstDecimal + 1).replace(/\./g, '');
  }
  
  // Remove multiple minus signs
  if (sanitized.indexOf('-') > 0) {
    sanitized = sanitized.replace(/-/g, '');
  }
  
  // Remove decimal point if not allowed
  if (!allowDecimals) {
    sanitized = sanitized.replace(/\./g, '');
  }
  
  // Remove minus sign if not allowed
  if (!allowNegative) {
    sanitized = sanitized.replace(/-/g, '');
  }

  // Convert to number and validate range
  const num = parseFloat(sanitized);
  if (isNaN(num)) {
    return '';
  }
  
  if (num > maxValue || num < minValue) {
    return '';
  }

  return sanitized;
}

/**
 * Sanitizes array of strings (for skills, tags, etc.)
 * @param input - Array of strings to sanitize
 * @returns Sanitized array of strings
 */
export function sanitizeStringArray(input: string[]): string[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .filter(item => typeof item === 'string' && item.trim().length > 0)
    .map(item => sanitizeText(item.trim(), { maxLength: 100 }))
    .filter(item => item.length > 0);
}

/**
 * Sanitizes object with string values
 * @param input - Object to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject(input: Record<string, any>): Record<string, any> {
  if (!input || typeof input !== 'object') {
    return {};
  }

  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = sanitizeStringArray(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Sanitizes form data object
 * @param formData - Form data object to sanitize
 * @returns Sanitized form data
 */
export function sanitizeFormData(formData: Record<string, any>): Record<string, any> {
  if (!formData || typeof formData !== 'object') {
    return {};
  }

  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(formData)) {
    switch (key.toLowerCase()) {
      case 'email':
        sanitized[key] = sanitizeEmail(value);
        break;
      case 'phone':
      case 'mobile':
      case 'telephone':
        sanitized[key] = sanitizePhone(value);
        break;
      case 'url':
      case 'website':
      case 'link':
        sanitized[key] = sanitizeURL(value);
        break;
      case 'salary':
      case 'price':
      case 'amount':
      case 'salarymin':
      case 'salarymax':
        sanitized[key] = sanitizeNumber(value, { allowDecimals: true, allowNegative: false });
        break;
      case 'skills':
      case 'tags':
      case 'certifications':
        sanitized[key] = sanitizeStringArray(value);
        break;
      case 'interviewstage':
        // Handle interview stages object with nested stages array
        if (typeof value === 'object' && value !== null && 'stages' in value) {
          sanitized[key] = {
            stages: Array.isArray(value.stages) ? value.stages.map((stage: any) => ({
              name: sanitizeText(stage.name || ''),
              round: typeof stage.round === 'number' ? stage.round : 1
            })) : []
          };
        } else {
          sanitized[key] = value;
        }
        break;
      case 'jobdescription':
      case 'description':
      case 'content':
        sanitized[key] = sanitizeText(value, { 
          maxLength: 50000, 
          allowHTML: true, 
          removeScripts: true 
        });
        break;
      default:
        if (typeof value === 'string') {
          sanitized[key] = sanitizeText(value);
        } else if (Array.isArray(value)) {
          sanitized[key] = sanitizeStringArray(value);
        } else if (typeof value === 'object' && value !== null) {
          sanitized[key] = sanitizeObject(value);
        } else {
          sanitized[key] = value;
        }
    }
  }
  
  return sanitized;
}

/**
 * Validates if input is safe (no dangerous content)
 * @param input - Input to validate
 * @returns true if safe, false if dangerous
 */
export function isInputSafe(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return true;
  }

  const dangerousPatterns = [
    /<script[^>]*>/i,
    /javascript:/i,
    /vbscript:/i,
    /on\w+\s*=/i,
    /union\s+select/i,
    /drop\s+table/i,
    /delete\s+from/i,
    /insert\s+into/i,
    /update\s+set/i
  ];

  return !dangerousPatterns.some(pattern => pattern.test(input));
}

/**
 * Logs security warnings for dangerous input
 * @param input - Input that triggered warning
 * @param context - Context where input was used
 */
export function logSecurityWarning(input: string, context: string): void {
  console.warn(`Security Warning: Potentially dangerous input detected in ${context}`);
  console.warn('Input:', input.substring(0, 100) + (input.length > 100 ? '...' : ''));
  console.warn('Full input length:', input.length);
}
