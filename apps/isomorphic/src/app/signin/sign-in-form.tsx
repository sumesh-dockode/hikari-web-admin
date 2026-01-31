'use client';

import Link from 'next/link';
import { SubmitHandler } from 'react-hook-form';
import { Input, Text, Button, Password } from 'rizzui';
import { useMedia } from '@core/hooks/use-media';
import { Form } from '@core/ui/form';
import { routes } from '@/config/routes';
import { loginSchema, LoginSchema } from '@/validators/login.schema';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';

export default function SignInForm() {
  const isMedium = useMedia('(max-width: 1200px)', false);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    try {
      setLoading(true);
      setApiError('');

      const res = await signIn('credentials', {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      if (res?.ok) {
        const session = await getSession();

        const accessToken = (session as any)?.accessToken;
        const refreshToken = (session as any)?.refreshToken;
        const user = (session as any)?.user;

        if (accessToken) localStorage.setItem('access', accessToken);
        if (refreshToken) localStorage.setItem('refresh', refreshToken);
        if (user) localStorage.setItem('user', JSON.stringify(user));

        console.log(' Stored tokens:', { accessToken, refreshToken });

        router.push('/');
        router.refresh();
        return;
      }

      setApiError('Invalid username or password');
    } catch (error) {
      setApiError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form<LoginSchema>
      validationSchema={loginSchema}
      onSubmit={onSubmit}
      useFormProps={{ mode: 'onChange' }}
    >
      {({ register, formState: { errors } }) => (
        <div className="space-y-5 lg:space-y-6">
          <Input
            type="text"
            size={isMedium ? 'lg' : 'xl'}
            label="username"
            placeholder="Enter your username"
            className="[&>label>span]:font-medium"
            {...register('username')}
            error={errors.username?.message}
          />

          <Password
            label="Password"
            placeholder="Enter your password"
            size={isMedium ? 'lg' : 'xl'}
            className="[&>label>span]:font-medium"
            {...register('password')}
            error={errors.password?.message}
          />

          <div className="flex items-center justify-between">
            {/* <Link
              href={routes.auth.forgotPassword3}
              className="h-auto p-0 text-sm font-semibold text-gray-600 underline transition-colors hover:text-primary hover:no-underline"
            >
              Forget Password?
            </Link> */}
            

            {apiError && (
              <Text className="text-sm font-medium text-red-600">
                {apiError}
              </Text>
            )}
          </div>

          <Button
            className="w-full bg-secondary1 hover:bg-secondary2"
            type="submit"
            size={isMedium ? 'lg' : 'xl'}
            isLoading={loading}
            disabled={loading}
          >
            Login
          </Button>
        </div>
      )}
    </Form>
  );
}
