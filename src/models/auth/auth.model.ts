import { z } from 'zod';

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
}

// zod schema
export const loginFormSchema = z.object({
  email: z.union([z.string().email(), z.string().min(1, 'Employee ID is required')]),
  password: z.string().min(6),
});

export const signupFormSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long')
      .regex(
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        'Password must contain at least one uppercase letter, one number, and one special character (!@#$%^&*)',
      ),
    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters long')
      .regex(
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        'Confirm password must contain at least one uppercase letter, one number, and one special character (!@#$%^&*)',
      ),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits long'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  }); 
