'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { SubmitHandler, Controller } from 'react-hook-form';
import SelectLoader from '@core/components/loader/select-loader';
import QuillLoader from '@core/components/loader/quill-loader';
import { Button, Input, Select, Text, Textarea, Title } from 'rizzui';
import cn from '@core/utils/class-names';
import { Form } from '@core/ui/form';
import { ServiceDetailsInput, serviceValidateSchema } from '@/validators/service-validate-schema';
import Image from 'next/image';

const QuillEditor = dynamic(() => import('@core/ui/quill-editor'), {
  ssr: false,
  loading: () => <QuillLoader className="col-span-full h-[168px]" />,
});

const statusOptions = [
  { value: 'offline', label: 'Offline' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'service_started', label: 'Service Started' },
  { value: 'Booking_initiated', label: 'Booking Initiated' },
  { value: 'confirm', label: 'Confirm' },
];

const HorizontalFormBlockWrapper = ({
  title,
  description,
  children,
  className,
  isModalView = true,
}: React.PropsWithChildren<{
  title: string;
  description?: string;
  className?: string;
  isModalView?: boolean;
}>) => {
  return (
    <div
      className={cn(
        className,
        isModalView ? '@5xl:grid @5xl:grid-cols-6' : ' '
      )}
    >
      {isModalView && (
        <div className="col-span-2 mb-6 pe-4 @5xl:mb-0">
          <Title as="h6" className="font-semibold">
            {title}
          </Title>
          <Text className="mt-1 text-sm text-gray-500">{description}</Text>
        </div>
      )}

      <div
        className={cn(
          'grid grid-cols-2 gap-3 @lg:gap-4 @2xl:gap-5',
          isModalView ? 'col-span-4' : ' '
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default function ServiceDetailsGallery({
  id,
  service,
  isModalView = true,
}: {
  id?: string;
  isModalView?: boolean;
  service?: ServiceDetailsInput;
}) {
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const serviceGallery = [
    'https://isomorphic-furyroad.s3.amazonaws.com/public/categories/bags.webp',
  ]
  
  const onSubmit: SubmitHandler<ServiceDetailsInput> = (data) => {
    // set timeout only required to display loading state of the create category button
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('createCategory data ->', data);
      setReset({
        productname: '',
        requestedby: '',
        promocode:'',
        selectedservice:'',
        status :''
      });
    }, 600);
  };

  return (
    <Form<ServiceDetailsInput>
      validationSchema={serviceValidateSchema}
      resetValues={reset}
      onSubmit={onSubmit}
      useFormProps={{
        mode: 'onChange',
        defaultValues: service,
      }}
      className="isomorphic-form flex flex-grow flex-col @container"
    >
      {({ register, control, getValues, setValue, formState: { errors } }) => (
        <>
          <div className="grid grid-cols-2 gap-3 @md:gap-4 @xl:gap-5 @2xl:gap-7">
            {serviceGallery.map((image, idx) => (
              <div
                key={`product-gallery-${idx}`}
                className="relative mx-auto aspect-[4/4.65] w-full overflow-hidden rounded bg-gray-100 @xl:rounded-md"
              >
                <Image
                  fill
                  priority
                  src={image}
                  alt={'Product Gallery'}
                  sizes="(max-width: 768px) 100vw"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>

          <div className="py-4">
            <Title as="h6" className="font-semibold">Service Status:</Title>
            <div className="mt-2">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={statusOptions}
                    error={errors?.status?.message}
                    placeholder="Select Service Status"
                    className="w-full"
                    onChange={(selectedOption: { value: string; label: string }) => {
                      field.onChange(selectedOption.value);
                    }}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex-grow pb-10">
            <div
              className={cn(
                'grid grid-cols-1',
                isModalView
                  ? 'grid grid-cols-1 gap-8 divide-y divide-dashed divide-gray-200 @2xl:gap-10 @3xl:gap-12 [&>div]:pt-7 first:[&>div]:pt-0 @2xl:[&>div]:pt-9 @3xl:[&>div]:pt-11'
                  : 'gap-5'
              )}
            >
              <HorizontalFormBlockWrapper
                title={'General Information:'}
                description={'You cannot update this information'}
                isModalView={isModalView}
              >
                <Input
                  label="Product Name"
                  placeholder="product name"
                  {...register('productname')}
                  error={errors?.productname?.message}
                />
                <Input
                  label="Requested By"
                  placeholder="requested by"
                  {...register('requestedby')}
                  error={errors.requestedby?.message}
                />
                <Input
                  label="Promo code"
                  placeholder="Promo Code"
                  {...register('promocode')}
                  error={errors.promocode?.message}
                />
                <Input
                  label="Selected Service"
                  placeholder="Selected Service"
                  {...register('selectedservice')}
                  error={errors.selectedservice?.message}
                />
              </HorizontalFormBlockWrapper>
            </div>
          </div>

          <div
            className={cn(
              'sticky bottom-0 z-40 flex items-center justify-end gap-3 bg-gray-0/10 backdrop-blur @lg:gap-4 @xl:grid @xl:auto-cols-max @xl:grid-flow-col',
              isModalView ? '-mx-10 -mb-7 px-10 py-5' : 'py-1'
            )}
          >
         
          </div>
        </>
      )}
    </Form>
  );
}
