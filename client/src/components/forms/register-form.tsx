'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useAuth } from '@/hooks';
import { registerSchema, type RegisterFormData } from '@/lib/validations';
import { Button, Input } from '@/components/ui';
import { ROUTES } from '@/lib/constants';

export function RegisterForm() {
  const { register: registerUser, registerMutation } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First name"
          placeholder="John"
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <Input
          label="Last name"
          placeholder="Doe"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>

      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        helperText="At least 8 characters with uppercase, lowercase, and number"
        error={errors.password?.message}
        {...register('password')}
      />

      <Input
        label="Confirm password"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      {registerMutation.isError && (
        <div className="rounded-lg bg-red-50 p-3">
          <p className="text-sm text-red-600">
            Registration failed. This email may already be in use.
          </p>
        </div>
      )}

      <Button
        type="submit"
        isLoading={registerMutation.isPending}
        className="w-full"
        size="lg"
      >
        Create account
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link
          href={ROUTES.LOGIN}
          className="font-medium text-gray-900 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;
