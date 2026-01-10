'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks';
import { loginSchema, type LoginFormData } from '@/lib/validations';
import { Button, Input } from '@/components/ui';
import { ROUTES } from '@/lib/constants';

export function LoginForm() {
  const { login, loginMutation } = useAuth();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
          />
          <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
            Remember me
          </label>
        </div>

        <Link
          href={ROUTES.FORGOT_PASSWORD}
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Forgot password?
        </Link>
      </div>

      {loginMutation.isError && (
        <div className="rounded-lg bg-red-50 p-3">
          <p className="text-sm text-red-600">
            Invalid email or password. Please try again.
          </p>
        </div>
      )}

      <Button
        type="submit"
        isLoading={loginMutation.isPending}
        className="w-full"
        size="lg"
      >
        Sign in
      </Button>

      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link
          href={redirectParam ? `${ROUTES.REGISTER}?redirect=${redirectParam}` : ROUTES.REGISTER}
          className="font-medium text-gray-900 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
