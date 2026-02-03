'use client';

import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Form } from '@core/ui/form';
import { Button, Password } from 'rizzui';
import { ProfileHeader } from '@/app/shared/account-settings/profile-settings';
import HorizontalFormBlockWrapper from '@/app/shared/account-settings/horiozontal-block';
import {
  passwordFormSchema,
  PasswordFormTypes,
} from '@/validators/password-settings.schema';
import toast from 'react-hot-toast';


type BackendUserType = {
  id: string;
  username: string;
  companies: string[];
};


export default function PasswordSettingsView({
  settings,
}: {
  settings?: PasswordFormTypes;
}) {
  const [isLoading, setLoading] = useState(false);
  const [reset, setReset] = useState({});
  const [user, setUser] = useState<BackendUserType | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');


  const getUserIdFromStorage = (): string | null => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return null;
      const parsedUser = JSON.parse(storedUser) as { id?: string };
      return parsedUser?.id ?? null;
    } catch {
      return null;
    }
  };


  useEffect(() => {
    const fetchUser = async () => {
      const accessToken = localStorage.getItem('access');
      const userId = getUserIdFromStorage();

      if (!accessToken || !userId || !baseUrl) return;

      try {
        const res = await fetch(
          `${baseUrl}/authentication/users/${userId}/`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!res.ok) return;

        const json = (await res.json()) as any;
        setUser(json?.data ?? null);
      } catch (err) {
        console.log('Fetch user error:', err);
      }
    };

    fetchUser();
  }, [baseUrl]);


  const changePassword = async (newPassword: string) => {
    const accessToken = localStorage.getItem('access');

    if (!accessToken) {
      toast.error('Token missing');
      return;
    }

    if (!baseUrl) {
      toast.error('API URL missing');
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/api/v1/change-password/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ new_password: newPassword }),
      });

      const result = (await res.json().catch(() => ({}))) as any;

      if (!res.ok) {
        toast.error(result?.message || 'Password update failed');
        return;
      }

      toast.success(result?.message || 'Password updated successfully');

      setReset({
        newPassword: '',
        confirmedPassword: '',
      });
    } catch (err) {
      console.log('Password change API error:', err);
      toast.error('Something went wrong');
    }
  };


  return (
    <Form
      validationSchema={passwordFormSchema}
      resetValues={reset}
      onSubmit={() => {}}
      useFormProps={{
        mode: 'onChange',
        defaultValues: {
          newPassword: '',
          confirmedPassword: '',
          ...settings,
        },
      }}
    >
      {({ control, formState: { errors }, getValues, trigger }) => {
        const handleClick = async () => {
          // Trigger validation on all fields
          const isValid = await trigger();
          
          // Double-check that passwords match
          const values = getValues();
          if (values.newPassword !== values.confirmedPassword) {
            toast.error('Passwords do not match');
            return;
          }
          
          if (!isValid) {
            toast.error('Please fix all validation errors');
            return;
          }

          try {
            setLoading(true);
            await changePassword(values.newPassword);
          } finally {
            setLoading(false);
          }
        };

        return (
          <>
          

            <div className="mx-auto w-full max-w-screen-2xl">
              <HorizontalFormBlockWrapper
                title="New Password"
                titleClassName="text-base font-medium"
              >
                <Controller
                  control={control}
                  name="newPassword"
                  render={({ field }) => (
                    <Password
                      placeholder="Enter new password"
                      value={field.value ?? ''}
                      onChange={(e) => {
                        field.onChange(e);
                        // Trigger validation on confirmedPassword when newPassword changes
                        if (getValues('confirmedPassword')) {
                          trigger('confirmedPassword');
                        }
                      }}
                      error={errors.newPassword?.message}
                    />
                  )}
                />
              </HorizontalFormBlockWrapper>

              <HorizontalFormBlockWrapper
                title="Confirm New Password"
                titleClassName="text-base font-medium"
              >
                <Controller
                  control={control}
                  name="confirmedPassword"
                  render={({ field }) => (
                    <Password
                      placeholder="Confirm password"
                      value={field.value ?? ''}
                      onChange={(e) => {
                        field.onChange(e);
                        // Trigger validation immediately when confirmedPassword changes
                        trigger('confirmedPassword');
                      }}
                      error={errors.confirmedPassword?.message}
                    />
                  )}
                />
              </HorizontalFormBlockWrapper>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleClick}
                >
                  Update Password
                </Button>
              </div>
            </div>
          </>
        );
      }}
    </Form>
  );
}
