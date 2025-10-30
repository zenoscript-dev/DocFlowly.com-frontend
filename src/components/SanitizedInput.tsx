/**
 * Sanitized Input Components
 * Pre-built input components with automatic sanitization
 */

import React, { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFormFieldSanitizer, useInputSanitizer } from '@/hooks/useInputSanitizer';

interface SanitizedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'email' | 'phone' | 'url' | 'number';
  context?: string;
  onValueChange?: (value: string) => void;
}

interface SanitizedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  context?: string;
  onValueChange?: (value: string) => void;
}

/**
 * Sanitized Input Component
 * Automatically sanitizes input based on type
 */
export const SanitizedInput = forwardRef<HTMLInputElement, SanitizedInputProps>(
  ({ type = 'text', context = 'input', onValueChange, onChange, ...props }, ref) => {
    const { 
      createTextHandler, 
      createEmailHandler, 
      createPhoneHandler, 
      createURLHandler, 
      createNumberHandler 
    } = useFormFieldSanitizer(context);

  const handleChange = (value: string) => {
    onValueChange?.(value);
  };

  const getSanitizedHandler = () => {
    switch (type) {
      case 'email':
        return createEmailHandler(handleChange);
      case 'phone':
        return createPhoneHandler(handleChange);
      case 'url':
        return createURLHandler(handleChange);
      case 'number':
        return createNumberHandler(handleChange);
      default:
        return createTextHandler(handleChange);
    }
  };

    return (
      <Input
        {...props}
        ref={ref}
        type={type}
        onChange={getSanitizedHandler()}
      />
    );
  }
);

SanitizedInput.displayName = 'SanitizedInput';

/**
 * Sanitized Textarea Component
 * Automatically sanitizes textarea input
 */
export const SanitizedTextarea = forwardRef<HTMLTextAreaElement, SanitizedTextareaProps>(
  ({ context = 'textarea', onValueChange, onChange, ...props }, ref) => {
    const { createTextHandler } = useFormFieldSanitizer(context);

  const handleChange = (value: string) => {
    onValueChange?.(value);
  };

  return (
    <Textarea
      {...props}
      ref={ref}
      onChange={createTextHandler(handleChange)}
    />
  );
  }
);

SanitizedTextarea.displayName = 'SanitizedTextarea';

/**
 * Sanitized Form Wrapper
 * Automatically sanitizes all form data before submission
 */
interface SanitizedFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  context?: string;
  onSanitizedSubmit?: (sanitizedData: Record<string, any>) => void;
}

export const SanitizedForm: React.FC<SanitizedFormProps> = ({
  context = 'form',
  onSanitizedSubmit,
  onSubmit,
  children,
  ...props
}) => {
  const { sanitizeForm } = useInputSanitizer(context);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {};
    
    // Convert FormData to object
    for (const [key, value] of formData.entries()) {
      if (data[key]) {
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    }
    
    // Sanitize the form data
    const sanitizedData = sanitizeForm(data);
    
    // Call the sanitized submit handler
    onSanitizedSubmit?.(sanitizedData);
    
    // Call the original submit handler
    onSubmit?.(e);
  };

  return (
    <form {...props} onSubmit={handleSubmit}>
      {children}
    </form>
  );
};
