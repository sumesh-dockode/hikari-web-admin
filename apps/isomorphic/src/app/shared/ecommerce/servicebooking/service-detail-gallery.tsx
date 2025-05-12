'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { PiCheckBold } from 'react-icons/pi';
import cn from '@core/utils/class-names';
import { Button, Text, Title } from 'rizzui';
import { useServiceStatusChange } from '@/hooks/services/useServiceStatusChange';
import { useServiceById } from '@/hooks/services/useServiceById';
import usePaginatedServices from '@/hooks/services/usePaginatedServices';
import noImage from '@public/no-image.jpg';
import useServiceStatus from '@/hooks/services/useServiceStatus';

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
  isModalView = true,
}: {
  isModalView?: boolean;
}) {
  const { id } = useParams();
  const { data: serviceData, isLoading } = useServiceById(id as string);
  const { data: serviceBookingAPIData } = usePaginatedServices({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data: serviceStatusActions } = useServiceStatus({
    pageIndex: 0,
    pageSize: 10,
  });
  const serviceBookingsAPIData =
    serviceBookingAPIData?.pages.flatMap((page: any) => page?.data?.results) ||
    [];
  const statusActions =
    serviceStatusActions?.pages.flatMap((page: any) => page?.data?.results) ||
    [];

  const currentService =
    serviceBookingsAPIData?.find((service: any) => service.id === id) ||
    serviceData;

  const { mutate: updateServiceStatus, status } = useServiceStatusChange();
  const currentStatusOrder =
    statusActions.find((action) => action.name === currentService?.status)
      ?.id || 0;
  // const {data,}
  const handleChangeStatus = (statusId: string) => {
    const status = statusActions.find((s) => s.id === statusId)?.name;

    if (status && id) {
      const payload = {
        status: status,
        id: id as string,
      };
      updateServiceStatus(payload);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-grow flex-col @container">
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
              // description={'You cannot update this information'}
              isModalView={isModalView}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Service To
                  </label>
                  <div className="mt-1 text-sm text-gray-900">
                    {currentService?.service_to || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Service Type
                  </label>
                  <div className="mt-1 text-sm text-gray-900">
                    {currentService?.service_type || 'N/A'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <div className="mt-1 text-sm text-gray-900">
                    {currentService?.description || 'N/A'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <div className="mt-1 text-sm text-gray-900">
                    {currentService?.price || 'N/A'}
                  </div>
                </div>
              </div>
            </HorizontalFormBlockWrapper>
          </div>
        </div>

        <div className="flex flex-col gap-8 @lg:flex-row">
          <WidgetCard
            title="Service Status"
            childrenWrapperClass="py-6 @5xl:py-8 flex"
          >
            <div className="ms-2 w-full space-y-7 border-s-2 border-gray-100">
              {statusActions
                .sort((a, b) => a.id - b.id) 
                .map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "relative ps-6 text-sm font-medium before:absolute before:-start-[9px] before:top-px before:h-5 before:w-5 before:-translate-x-px before:rounded-full before:bg-gray-100 before:content-[''] after:absolute after:-start-px after:top-5 after:h-10 after:w-0.5 after:content-[''] last:after:hidden",
                      currentStatusOrder > item.id
                        ? 'before:bg-primary after:bg-primary'
                        : 'after:hidden',
                      currentStatusOrder === item.id && 'before:bg-primary',
                      currentStatusOrder + 1 < item.id && 'text-gray-300'
                    )}
                  >
                    {currentStatusOrder >= item.id ? (
                      <span className="absolute -start-1.5 top-1 text-white">
                        <PiCheckBold className="h-auto w-3" />
                      </span>
                    ) : null}

                    {currentStatusOrder + 1 !== item.id ? (
                      item.name 
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        isLoading={status === 'pending'}
                        onClick={() => handleChangeStatus(item.id)}
                      >
                        {item.name} {/* Using name directly */}
                      </Button>
                    )}
                  </div>
                ))}
            </div>
          </WidgetCard>
        </div>
        <div className="w-full @lg:w-[40%] @xl:w-[23%]">
          <div className="sticky top-8">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
              <Image
                fill
                priority
                src={currentService?.image || noImage}
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
    </div>
  );
}
