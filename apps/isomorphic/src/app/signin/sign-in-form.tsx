'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { SubmitHandler } from 'react-hook-form';
import { PiArrowRightBold } from 'react-icons/pi';
import { Checkbox, Password, Button, Input, Text } from 'rizzui';
import { Form } from '@core/ui/form';
import { routes } from '@/config/routes';
import { loginSchema, LoginSchema } from '@/validators/login.schema';
import { useSearchParams } from 'next/navigation';

const initialValues: LoginSchema = {
  username: '',
  password: '',
};

export default function SignInForm() {
  //TODO: why we need to reset it here
  const [reset, setReset] = useState({});
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    try {
      setLoading(true);
      await signIn('credentials', {
        ...data,
      });
    } finally {
      setLoading(false);
    }
  };
  const errorMessages: Record<string, string> = {
    CredentialsSignin: 'Invalid username or password.',
     ShopAccessDenied: 'You cannot access or authorize to admin portal.',
    Credentials: 'Invalid username or password.',
  };

  const displayError =
    error && errorMessages[error]
      ? errorMessages[error]
      : error
        ? decodeURIComponent(error)
        : '';

  return (
    <>
      {displayError && (
        <div className="mb-4 text-center text-sm text-red-600 font-semibold">
          {displayError}
        </div>
      )}
      <Form<LoginSchema>
        validationSchema={loginSchema}
        resetValues={reset}
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: initialValues,
        }}
      >
        {({ register, formState: { errors } }) => (
          <div className="space-y-5">
            <Input
              type="text"
              size="lg"
              label="Username"
              placeholder="Enter your username"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('username')}
              error={errors.username?.message}
            />

            <Password
              label="Password"
              placeholder="Enter your password"
              size="lg"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('password')}
              error={errors.password?.message}
            />
            <div className="flex justify-end pb-2">
              <Link
                href={routes.forgotPassword}
                className="h-auto p-0 text-sm font-semibold text-blue underline transition-colors hover:text-gray-900 hover:no-underline"
              >
                Forget Password?
              </Link>
            </div>
            <Button
              className="w-full"
              type="submit"
              size="lg"
              isLoading={loading}
            >
              <span>Sign in</span>{' '}
              <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5" />
            </Button>
          </div>
        )}
      </Form>
    </>
  );
}
