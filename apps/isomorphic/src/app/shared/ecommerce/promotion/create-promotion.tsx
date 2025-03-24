'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { SubmitHandler, Controller } from 'react-hook-form';
import SelectLoader from '@core/components/loader/select-loader';
import QuillLoader from '@core/components/loader/quill-loader';
import { Button, Input, Select, Text, Textarea, Title } from 'rizzui';
import cn from '@core/utils/class-names';
import { Form } from '@core/ui/form';
import UploadZone from '@core/ui/file-upload/upload-zone';
import {
  PromotionFormInput,
  promotionFormSchema,
} from '@/validators/create-promotion.schema';

const QuillEditor = dynamic(() => import('@core/ui/quill-editor'), {
  ssr: false,
  loading: () => <QuillLoader className="col-span-full h-[168px]" />,
});

// a reusable form wrapper component
function HorizontalFormBlockWrapper({
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
}>) {
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
}

// main category form component for create and update category
export default function CreatePromotion({
  id,
  promotion,
  isModalView = true,
}: {
  id?: string;
  isModalView?: boolean;
  promotion?: PromotionFormInput;
}) {
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<PromotionFormInput> = (data) => {
    // set timeout ony required to display loading state of the create category button
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('createCategory data ->', data);
      setReset({
        productname: '',
        requestedby: '',
        comments: '',
        aspectratio: '',
        area: '',
        promotionmedium: '',
        document: [],
        images: [],
      });
    }, 600);
  };

  return (
    <Form<PromotionFormInput>
      validationSchema={promotionFormSchema}
      resetValues={reset}
      onSubmit={onSubmit}
      useFormProps={{
        mode: 'onChange',
        defaultValues: promotion,
      }}
      className="isomorphic-form flex flex-grow flex-col @container"
    >
      {({ register, control, getValues, setValue, formState: { errors } }) => (
        <>
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
                  readOnly
                  error={errors?.productname?.message}
                />
                <Input
                  label="Requested By"
                  placeholder="requested by"
                  {...register('requestedby')}
                  readOnly
                  error={errors.requestedby?.message}
                />
                <Input
                  label="Aspect Ratio"
                  placeholder="aspect ratio"
                  {...register('aspectratio')}
                  readOnly
                  error={errors.aspectratio?.message}
                />
                <Input
                  label="Area"
                  placeholder="area"
                  {...register('area')}
                  readOnly
                  error={errors.area?.message}
                />
                <Input
                  label="Promotion Medium"
                  placeholder="promotion medium"
                  {...register('promotionmedium')}
                  readOnly
                  error={errors.promotionmedium?.message}
                />
                <Textarea
                  label="Comments"
                  placeholder="comments"
                  className="col-span-full"
                  {...register('comments')}
                  readOnly
                  error={errors.comments?.message}
                />
              </HorizontalFormBlockWrapper>
              <HorizontalFormBlockWrapper
                title="Upload promotion image"
                description="Upload your product image gallery here"
                isModalView={isModalView}
              >
                <UploadZone
                  name="images"
                  getValues={getValues}
                  setValue={setValue}
                  className="col-span-full"
                />
              </HorizontalFormBlockWrapper>
              <HorizontalFormBlockWrapper
                title="Upload promotion document"
                description="Upload your promotion document here"
                isModalView={isModalView}
              >
                <UploadZone
                  name="document"
                  getValues={getValues}
                  setValue={setValue}
                  className="col-span-full"
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
            {/* <Button variant="outline" className="w-full @xl:w-auto">
              Save as Draft
            </Button> */}
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full @xl:w-auto"
            >
              Update promotion
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}
