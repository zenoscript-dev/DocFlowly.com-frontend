import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    signupFormSchema,
    type SignupFormData,
} from '@/models/auth/auth.model';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, GalleryVerticalEnd, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

// Country data with flags
const countries = [
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91' },
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81' },
  { code: 'CN', name: 'China', flag: '🇨🇳', dialCode: '+86' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', dialCode: '+52' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', dialCode: '+7' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', dialCode: '+82' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', dialCode: '+971' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '+27' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234' },
];

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Default to first country
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  const onSubmit = async (formData: SignupFormData) => {
    setIsLoading(true);
    try {
      const { authService } = await import('@/services/auth/authService');
      const response = await authService.signup({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });
      
      if (response.success) {
        // Show success message and redirect to signin
        alert('Account created successfully! Please sign in.');
        window.location.href = '/signin';
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      alert(error?.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setValue('phone', value);
    }
  };

  const handleCountrySelect = (countryCode: string) => {
    const country = countries.find((c) => c.code === countryCode);
    if (country) {
      setSelectedCountry(country);
    }
  };

  return (
    <div className='from-background to-accent/5 flex min-h-screen w-full items-center justify-center bg-gradient-to-br px-4 py-8 sm:px-6 lg:px-8'>
      <div className='bg-card/50 border-border/50 shadow-custom-color/10 animate-fade-in mx-auto flex w-full max-w-xl flex-col items-center justify-center rounded-xl border p-8 shadow-2xl backdrop-blur-sm'>
        <div className='mb-8 flex justify-center gap-3 sm:justify-start'>
          <a
            href='/'
            className='group hover:text-custom-color flex items-center gap-3 font-semibold transition-colors'
          >
               
                <div className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-lg hover:shadow-xl transition-shadow duration-300'>
                  <GalleryVerticalEnd className='h-5 w-5' />
                </div>
            <span className='text-xl tracking-tight sm:text-2xl'>
              {import.meta.env.VITE_APPLICATION_NAME}
            </span>
          </a>
        </div>
        <div className='w-full'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-6'
          >
            <div className='flex flex-col items-center gap-2 text-center'>
              <h1 className='text-2xl font-bold'>Create an account</h1>
              <p className='text-muted-foreground text-sm text-balance'>
                Enter your details below to create your account
              </p>
            </div>
            <div className='grid gap-6'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='grid gap-3'>
                  <Label htmlFor='firstName'>
                    First Name <span className='text-destructive'>*</span>
                  </Label>
                  <Input
                    id='firstName'
                    placeholder='John'
                    {...register('firstName')}
                  />
                  {errors.firstName && (
                    <span className='text-destructive text-sm'>
                      {errors.firstName.message}
                    </span>
                  )}
                </div>
                <div className='grid gap-3'>
                  <Label htmlFor='lastName'>
                    Last Name <span className='text-destructive'>*</span>
                  </Label>
                  <Input
                    id='lastName'
                    placeholder='Doe'
                    {...register('lastName')}
                  />
                  {errors.lastName && (
                    <span className='text-destructive text-sm'>
                      {errors.lastName.message}
                    </span>
                  )}
                </div>
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='email'>
                  Email <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                  {...register('email')}
                />
                {errors.email && (
                  <span className='text-destructive text-sm'>
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='phone'>
                  Phone Number <span className='text-destructive'>*</span>
                </Label>
                <div className='flex gap-2'>
                  <Select
                    value={selectedCountry.code}
                    onValueChange={handleCountrySelect}
                  >
                    <SelectTrigger className='w-[140px]'>
                      <SelectValue>
                        <div className='flex items-center gap-2'>
                          <span className='text-lg'>
                            {selectedCountry.flag}
                          </span>
                          <span className='text-sm font-medium'>
                            {selectedCountry.dialCode}
                          </span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          <div className='flex items-center gap-3'>
                            <span className='text-lg'>{country.flag}</span>
                            <span className='text-sm font-medium'>
                              {country.dialCode}
                            </span>
                            <span className='text-muted-foreground text-sm'>
                              {country.name}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id='phone'
                    placeholder='1234567890'
                    value={watch('phone') || ''}
                    onChange={handlePhoneChange}
                    maxLength={10}
                    className='flex-1'
                  />
                </div>
                {errors.phone && (
                  <span className='text-destructive text-sm'>
                    {errors.phone.message}
                  </span>
                )}
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='password'>
                  Password <span className='text-destructive'>*</span>
                </Label>
                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Create a strong password'
                    {...register('password')}
                    className='pr-10'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transform transition-colors'
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className='text-destructive text-sm'>
                    {errors.password.message}
                  </span>
                )}
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='confirmPassword'>
                  Confirm Password <span className='text-destructive'>*</span>
                </Label>
                <div className='relative'>
                  <Input
                    id='confirmPassword'
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='Confirm your password'
                    {...register('confirmPassword')}
                    className='pr-10'
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transform transition-colors'
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className='text-destructive text-sm'>
                    {errors.confirmPassword.message}
                  </span>
                )}
                {password &&
                  confirmPassword &&
                  password !== confirmPassword && (
                    <span className='text-destructive text-sm'>
                      Passwords do not match
                    </span>
                  )}
              </div>
              <Button
                type='submit'
                className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer w-full'
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
              <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                <span className='bg-background text-muted-foreground relative z-10 px-2'>
                  Or continue with
                </span>
              </div>
              <Button variant='outline' className='w-full'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  viewBox='0 0 23 23'
                  className='mr-2'
                >
                  <path fill='#f35325' d='M1 1h10v10H1z' />
                  <path fill='#81bc06' d='M12 1h10v10H12z' />
                  <path fill='#05a6f0' d='M1 12h10v10H1z' />
                  <path fill='#ffba08' d='M12 12h10v10H12z' />
                </svg>
                Sign up with Microsoft Account
              </Button>
            </div>
            <div className='text-center text-sm'>
              Already have an account?{' '}
              <a href='/signin' className='underline underline-offset-4'>
                Sign in
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
