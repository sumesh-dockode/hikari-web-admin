'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { SubmitHandler, Controller } from 'react-hook-form';
import SelectLoader from '@core/components/loader/select-loader';
import QuillLoader from '@core/components/loader/quill-loader';
import { Button, Input, Select, Text, Textarea, Title } from 'rizzui';
import cn from '@core/utils/class-names';
import { Form } from '@core/ui/form';
import {
  ServiceDetailsInput,
  serviceValidateSchema,
} from '@/validators/service-validate-schema';
import Image from 'next/image';

import { PiCheckBold } from 'react-icons/pi';
import { useServiceStatusChange } from '@/hooks/services/useServiceStatusChange';

const QuillEditor = dynamic(() => import('@core/ui/quill-editor'), {
  ssr: false,
  loading: () => <QuillLoader className="col-span-full h-[168px]" />,
});

const statusOptions = [
  { id: 1, value: 'offline', label: 'Offline' },
  { id: 2, value: 'pending', label: 'Pending' },
  { id: 3, value: 'paid', label: 'Paid' },
  { id: 4, value: 'completed', label: 'Completed' },
  { id: 5, value: 'cancelled', label: 'Cancelled' },
  { id: 6, value: 'service_started', label: 'Service Started' },
  { id: 7, value: 'Booking_initiated', label: 'Booking Initiated' },
  { id: 8, value: 'confirm', label: 'Confirm' },
];
function WidgetCard({
  title,
  className,
  children,
  childrenWrapperClass,
}: {
  title?: string;
  className?: string;
  children: React.ReactNode;
  childrenWrapperClass?: string;
}) {
  return (
    <div className={className}>
      <Title
        as="h3"
        className="mb-3.5 text-base font-semibold @5xl:mb-5 4xl:text-lg"
      >
        {title}
      </Title>
      <div
        className={cn(
          'rounded-lg border border-muted px-5 @sm:px-7 @5xl:rounded-xl',
          childrenWrapperClass
        )}
      >
        {children}
      </div>
    </div>
  );
}
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
    <div className={cn(className, isModalView ? '' : ' ')}>
      {isModalView && (
        <div className="col-span-2 mb-6 pe-4 @5xl:mb-0">
          <Title as="h6" className="font-semibold">
            {title}
          </Title>
          <Text className="mt-3 text-sm text-gray-500">{description}</Text>
        </div>
      )}

      <div
        className={cn(
          'mt-3 grid grid-cols-2 gap-3 @lg:gap-4 @2xl:gap-5',
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
  ];
  const { mutate: updateServiceStatus, status } = useServiceStatusChange();
  const [currentOrderStatus, setCurrentOrderStatus] = useState(1);
  const onSubmit: SubmitHandler<ServiceDetailsInput> = (data) => {
    // set timeout only required to display loading state of the create category button
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('createCategory data ->', data);
      setReset({
        productname: '',
        requestedby: '',
        promocode: '',
        selectedservice: '',
        status: '',
      });
    }, 600);
  };

  const handleChangeStatus = (orderId: number) => {
    const status = statusOptions.find((status) => status.id === orderId)?.label;

    if (status) {
      const payload = {
        status: status,
        id: id as string,
      };

      updateServiceStatus(payload);
    }
    // }
    // setIsStatusChangeLoading(true);
    // setTimeout(() => {
    //   setCurrentOrderStatus(id);
    //   setIsStatusChangeLoading(false);
    // }, 1000);
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
          <div className="flex flex-col gap-8 @lg:flex-row">
            <div className="flex-grow">
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
                    {...register('name')}
                    error={errors?.name?.message}
                    inputClassName=""
                    readOnly
                  />
                  <Input
                    label="Requested By"
                    placeholder="requested by"
                    {...register('requesteduser')}
                    error={errors.requesteduser?.message}
                    inputClassName=""
                    readOnly
                  />
                  <Input
                    label="Promo code"
                    placeholder="Promo Code"
                    {...register('promocode')}
                    error={errors.promocode?.message}
                    inputClassName=""
                    readOnly
                  />
                  <Input
                    label="Selected Service"
                    placeholder="Selected Service"
                    {...register('selectedservices')}
                    error={errors.selectedservices?.message}
                    inputClassName=""
                    readOnly
                  />
                </HorizontalFormBlockWrapper>
              </div>
            </div>
            <div className="flex flex-col gap-8 @lg:flex-row">
              <WidgetCard
                title="Service Status"
                childrenWrapperClass="py-6 @5xl:py-8 flex"
              >
                <div className="ms-2 w-full space-y-7 border-s-2 border-gray-100">
                  {statusOptions.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "relative ps-6 text-sm font-medium before:absolute before:-start-[9px] before:top-px before:h-5 before:w-5 before:-translate-x-px before:rounded-full before:bg-gray-100 before:content-[''] after:absolute after:-start-px after:top-5 after:h-10 after:w-0.5 after:content-[''] last:after:hidden",
                        currentOrderStatus > item.id
                          ? 'before:bg-primary after:bg-primary'
                          : 'after:hidden',
                        currentOrderStatus === item.id && 'before:bg-primary',
                        currentOrderStatus + 1 < item.id && 'text-gray-300'
                      )}
                    >
                      {currentOrderStatus >= item.id ? (
                        <span className="absolute -start-1.5 top-1 text-white">
                          <PiCheckBold className="h-auto w-3" />
                        </span>
                      ) : null}

                      {currentOrderStatus + 1 !== item.id ? (
                        item.label
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          isLoading={status === 'pending'}
                          onClick={() => handleChangeStatus(item.id)}
                        >
                          {item.label}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </WidgetCard>
            </div>

            {/* Right side - Image */}
            <div className="w-full @lg:w-[40%] @xl:w-[23%]">
              <div className="sticky top-8">
                <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                  <Image
                    fill
                    priority
                    src={serviceGallery[0]}
                    alt={'Product Gallery'}
                    sizes="(max-width: 768px) 100vw"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className={cn(
              'sticky bottom-0 z-40 flex items-center justify-end gap-3 bg-gray-0/10 backdrop-blur @lg:gap-4 @xl:grid @xl:auto-cols-max @xl:grid-flow-col',
              isModalView ? '-mx-10 -mb-7 px-10 py-5' : 'py-1'
            )}
          >
            {/* Action buttons can go here if needed */}
          </div>
        </>
      )}
    </Form>
  );
}
