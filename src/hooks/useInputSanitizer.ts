/**
 * React Hook for Input Sanitization
 * Provides easy-to-use sanitization functions for React components
 */

import { useCallback } from 'react';
import { 
  sanitizeText, 
  sanitizeEmail, 
  sanitizePhone, 
  sanitizeURL, 
  sanitizeNumber, 
  sanitizeStringArray, 
  sanitizeFormData,
  isInputSafe,
  logSecurityWarning
} from '@/utils/inputSanitizer';

export interface SanitizationOptions {
  maxLength?: number;
  allowHTML?: boolean;
  removeScripts?: boolean;
  removeSQL?: boolean;
  trimWhitespace?: boolean;
}

export interface NumberSanitizationOptions {
  allowDecimals?: boolean;
  allowNegative?: boolean;
  maxValue?: number;
  minValue?: number;
}

/**
 * Hook for input sanitization
 * @param context - Context for logging (e.g., 'jobTitle', 'email')
 * @returns Sanitization functions
 */
export function useInputSanitizer(context: string = 'input') {
  
  const sanitize = useCallback((input: string, options: SanitizationOptions = {}) => {
    const sanitized = sanitizeText(input, options);
    
    if (!isInputSafe(input)) {
      logSecurityWarning(input, context);
    }
    
    return sanitized;
  }, [context]);

  const sanitizeEmailInput = useCallback((email: string) => {
    const sanitized = sanitizeEmail(email);
    
    if (!isInputSafe(email)) {
      logSecurityWarning(email, `${context}-email`);
    }
    
    return sanitized;
  }, [context]);

  const sanitizePhoneInput = useCallback((phone: string) => {
    const sanitized = sanitizePhone(phone);
    
    if (!isInputSafe(phone)) {
      logSecurityWarning(phone, `${context}-phone`);
    }
    
    return sanitized;
  }, [context]);

  const sanitizeURLInput = useCallback((url: string) => {
    const sanitized = sanitizeURL(url);
    
    if (!isInputSafe(url)) {
      logSecurityWarning(url, `${context}-url`);
    }
    
    return sanitized;
  }, [context]);

  const sanitizeNumberInput = useCallback((input: string, options: NumberSanitizationOptions = {}) => {
    const sanitized = sanitizeNumber(input, options);
    
    if (!isInputSafe(input)) {
      logSecurityWarning(input, `${context}-number`);
    }
    
    return sanitized;
  }, [context]);

  const sanitizeArrayInput = useCallback((input: string[]) => {
    const sanitized = sanitizeStringArray(input);
    
    // Check each item for safety
    input.forEach((item, index) => {
      if (!isInputSafe(item)) {
        logSecurityWarning(item, `${context}-array-${index}`);
      }
    });
    
    return sanitized;
  }, [context]);

  const sanitizeForm = useCallback((formData: Record<string, any>) => {
    const sanitized = sanitizeFormData(formData);
    
    // Check each field for safety
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === 'string' && !isInputSafe(value)) {
        logSecurityWarning(value, `${context}-${key}`);
      }
    });
    
    return sanitized;
  }, [context]);

  const validateInput = useCallback((input: string) => {
    return isInputSafe(input);
  }, []);

  return {
    sanitize,
    sanitizeEmail: sanitizeEmailInput,
    sanitizePhone: sanitizePhoneInput,
    sanitizeURL: sanitizeURLInput,
    sanitizeNumber: sanitizeNumberInput,
    sanitizeArray: sanitizeArrayInput,
    sanitizeForm,
    validateInput
  };
}

/**
 * Hook for form field sanitization with onChange handlers
 * @param context - Context for logging
 * @returns Sanitized onChange handlers
 */
export function useFormFieldSanitizer(context: string = 'form') {
  const { sanitize, sanitizeEmail, sanitizePhone, sanitizeURL, sanitizeNumber } = useInputSanitizer(context);

  const createTextHandler = useCallback((onChange: (value: string) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const sanitized = sanitize(e.target.value);
      onChange(sanitized);
    };
  }, [sanitize]);

  const createEmailHandler = useCallback((onChange: (value: string) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const sanitized = sanitizeEmail(e.target.value);
      onChange(sanitized);
    };
  }, [sanitizeEmail]);

  const createPhoneHandler = useCallback((onChange: (value: string) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const sanitized = sanitizePhone(e.target.value);
      onChange(sanitized);
    };
  }, [sanitizePhone]);

  const createURLHandler = useCallback((onChange: (value: string) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const sanitized = sanitizeURL(e.target.value);
      onChange(sanitized);
    };
  }, [sanitizeURL]);

  const createNumberHandler = useCallback((onChange: (value: string) => void, options?: NumberSanitizationOptions) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const sanitized = sanitizeNumber(e.target.value, options);
      onChange(sanitized);
    };
  }, [sanitizeNumber]);

  return {
    createTextHandler,
    createEmailHandler,
    createPhoneHandler,
    createURLHandler,
    createNumberHandler
  };
}
