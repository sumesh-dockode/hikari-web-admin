'use client';

import { useEffect, useState } from 'react';
import { SubmitHandler, Controller } from 'react-hook-form';
import { Button, Input, Password, Switch } from 'rizzui';
import cn from '@core/utils/class-names';
import { Form } from '@core/ui/form';
import { PiEnvelopeSimple } from 'react-icons/pi';
import {
  getSalesmanFormSchema,
  SalesmanFormInput,
} from '@/validators/create-salesman.schema';
import FormGroup from '@/app/shared/form-group';
import toast from 'react-hot-toast';
import { routes } from '@/config/routes';
import PageLoader from '@/app/shared/page-loader';
import { useRouter } from 'next/navigation';
import { useSalesManById } from '@/hooks/sales/salesman/useSalesManById';
import { useCreateSalesMan } from '@/hooks/sales/salesman/useCreateSalesMan';
import { useUpdateSalesMan } from '@/hooks/sales/salesman/useUpdateSalesMan';
import { PhoneNumber } from '@core/ui/phone-input';
import usePaginatedStoreManager from '@/hooks/storeManager/usePaginatedStoreManager';
import { debounce } from 'lodash';
import StoreManagerSelectionField from '@/app/shared/store-manager-selection-field';

export const salesmanDefaultValues = {
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  username: '',
  password: '',
  is_active: true,
  store_manager_id: undefined,
};

// main category form component for create and update category
export default function CreateSalesMan({
  id,
  isModalView = true,
}: {
  id?: string;
  isModalView?: boolean;
}) {
  const { push } = useRouter();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { data: storeManagerData, isLoading: isFetchingStoreManager } =
    usePaginatedStoreManager({
      search: searchText,
    });
  const {
    data,
    isLoading: isFetching,
    error: fetchError,
  } = useSalesManById(id || '');
  const {
    mutate: createSalesMan,
    data: salesmanData,
    status: createStatus,
  } = useCreateSalesMan();

  const {
    mutate: updateSalesMan,
    data: updateResponseData,
    status: updateStatus,
  } = useUpdateSalesMan();

  useEffect(() => {
    if (data) {
      const detailData = data?.data;
      const resetData = {
        id: detailData?.id || null,
        first_name: detailData?.first_name || '',
        last_name: detailData?.last_name || '',
        email: detailData?.email || '',
        phone_number: detailData?.phone_number || '',
        username: detailData?.username || '',
        password: '',
        is_active: detailData?.is_active || false,
        store_manager_id: detailData?.store_manager?.id,
      };
      setReset(resetData);
    }
  }, [data]);

  const onSubmit: SubmitHandler<SalesmanFormInput> = (data) => {
    setLoading(true);
    let payload: any = {
      id: id || null,
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      email: data.email || '',
      phone_number: data.phone_number || '',
      username: data.username || '',
      is_active: data.is_active || false,
      store_manager_id: data.store_manager_id || null,
    };
    if (data.password?.trim()) {
      payload.password = data.password;
    }

    id ? updateSalesMan(payload) : createSalesMan(payload);
  };

  useEffect(() => {
    if (createStatus === 'pending' || updateStatus === 'pending') return;

    if (
      (createStatus === 'success' && salesmanData) ||
      (updateStatus === 'success' && updateResponseData)
    ) {
      toast.success(
        id ? 'Salesman updated successfully' : 'Salesman created successfully'
      );

      setReset(salesmanDefaultValues);

      push(routes.eCommerce.salesman);

      setLoading(false);
    } else if (createStatus === 'error' || updateStatus === 'error') {
      setLoading(false);
    }
  }, [createStatus, updateStatus]);

  const handleStoreManagerSearch = debounce((value: string) => {
    setSearchText(value);
  }, 500);

  if (isFetching || isFetchingStoreManager) return <PageLoader />;

  if (fetchError) throw fetchError;

  return (
    <Form<SalesmanFormInput>
      validationSchema={getSalesmanFormSchema(!!id)}
      resetValues={reset}
      onSubmit={onSubmit}
      useFormProps={{
        mode: 'onChange',
        defaultValues: salesmanDefaultValues,
      }}
      className="isomorphic-form flex flex-grow flex-col @container"
    >
      {({ register, control, watch, setValue, formState: { errors } }) => (
        <>
          <div className="flex-grow pb-10">
            <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
              <FormGroup
                title={'Name'}
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  placeholder="First Name"
                  {...register('first_name')}
                  error={errors.first_name?.message}
                  className="flex-grow"
                />
                <Input
                  placeholder="Last Name"
                  {...register('last_name')}
                  error={errors.last_name?.message}
                  className="flex-grow"
                />
              </FormGroup>
              <FormGroup
                title="Email & Phone Number"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  className="flex-grow"
                  prefix={
                    <PiEnvelopeSimple className="h-6 w-6 text-gray-500" />
                  }
                  type="email"
                  placeholder="georgia.young@example.com"
                  {...register('email')}
                  error={errors.email?.message}
                />
                <Controller
                  name="phone_number"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <PhoneNumber
                      country="in"
                      value={value}
                      onChange={onChange}
                      className="rtl:[&>.selected-flag]:right-0"
                      inputClassName="rtl:pr-12"
                      buttonClassName="rtl:[&>.selected-flag]:right-2 rtl:[&>.selected-flag_.arrow]:-left-6"
                      error={errors.phone_number?.message}
                    />
                  )}
                />
              </FormGroup>
              <FormGroup
                title={'Username & Password'}
                description={'This will be the login credential.'}
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  placeholder="Username"
                  {...register('username')}
                  error={errors.username?.message}
                  className="flex-grow"
                />
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <Password
                      placeholder={
                        id
                          ? 'Enter new password (optional)'
                          : 'Enter your password'
                      }
                      onChange={onChange}
                      value={value}
                      error={errors.password?.message}
                      helperText={
                        id
                          ? 'Leave blank to keep current password'
                          : value && value?.length < 8
                            ? 'Password must be at least 8 characters'
                            : ''
                      }
                    />
                  )}
                />
              </FormGroup>
              <FormGroup
                title="Store Manager"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <StoreManagerSelectionField
                  key={watch('store_manager_id')}
                  value={watch('store_manager_id')}
                  onChange={(value) => setValue('store_manager_id', value)}
                  error={errors.store_manager_id?.message}
                />
              </FormGroup>
              <FormGroup
                title={'Status'}
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Switch
                  label="Active"
                  variant="flat"
                  labelClassName="font-medium text-sm text-gray-900"
                  {...register('is_active')}
                />
              </FormGroup>
            </div>
          </div>

          <div
            className={cn(
              'sticky bottom-0 z-40 flex items-center justify-end gap-3 bg-gray-0/10 backdrop-blur @lg:gap-4 @xl:grid @xl:auto-cols-max @xl:grid-flow-col',
              isModalView ? '-mx-10 -mb-7 px-10 py-5' : 'py-1'
            )}
          >
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full @xl:w-auto"
            >
              {id ? 'Update' : 'Create'} Salesman
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}
