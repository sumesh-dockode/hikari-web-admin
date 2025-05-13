'use client';

import { useEffect, useState } from 'react';
import { SubmitHandler, Controller } from 'react-hook-form';
import { Button, Input, Select, Text, Textarea, Title } from 'rizzui';
import cn from '@core/utils/class-names';
import { Form } from '@core/ui/form';
import UploadZone from '@core/ui/file-upload/upload-zone';
import {
  PromotionFormInput,
  promotionFormSchema,
} from '@/validators/create-promotion.schema';
import FormGroup from '../../form-group';
import { useRouter } from 'next/navigation';
import { usePromotionById } from '@/hooks/promotions/usePromotionById';

export default function CreatePromotion({
  id,
  isModalView = true,
}: {
  id?: string;
  isModalView?: boolean;
}) {
  const { push } = useRouter();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const {
    data,
    isLoading: isFetching,
    error: fetchError,
  } = usePromotionById(id || '');

  useEffect(() => {
    if (data) {
      const detailData = data?.data;
      const resetData = {
        id: detailData?.id || null,
        store_manager: detailData?.store_manager || null,
        product: detailData?.product || null,
        promotion_medium: detailData?.promotion_medium || null,
        aspect_ratio: detailData?.aspect_ratio || null,
        area_latitude: detailData?.area_latitude || null,
        area_longitude: detailData?.area_longitude || null,
        comments: detailData?.comments || null,
        promotion_image: detailData?.promotion_image || null,
        promotion_document: detailData?.promotion_document || null,
      };
      setReset(resetData);
    }
  }, [data]);

  const onSubmit: SubmitHandler<PromotionFormInput> = (data) => {
    // set timeout ony required to display loading state of the create category button
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('createCategory data ->', data);
      setReset({
        store_manager: '',
        promotion_medium: '',
        product: '',
        comments: '',
        aspect_ratio: '',
        area_latitude: '',
        area_longitude: '',
        promotion_document: [],
        promotion_image: [],
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
        defaultValues: {},
      }}
      className="isomorphic-form flex flex-grow flex-col @container"
    >
      {({ register, control, getValues, setValue, formState: { errors } }) => (
        <>
          <div className="flex-grow pb-10">
            <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
              <FormGroup
                title={'General Information'}
                description={'You cannot update this information'}
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  label="Product Name"
                  placeholder="product name"
                  {...register('product')}
                  readOnly
                  error={errors?.product?.message}
                />
                <Input
                  label="Requested By"
                  placeholder="requested by"
                  {...register('store_manager')}
                  readOnly
                  error={errors.store_manager?.message}
                />
                <Input
                  label="Aspect Ratio"
                  placeholder="aspect ratio"
                  {...register('aspect_ratio')}
                  readOnly
                  error={errors.aspect_ratio?.message}
                />
                <Input
                  label="Promotion Medium"
                  placeholder="promotion medium"
                  {...register('promotion_medium')}
                  readOnly
                  error={errors.promotion_medium?.message}
                />
                <Input
                  label="Area Longitude"
                  placeholder="area longitude"
                  {...register('area_longitude')}
                  readOnly
                  error={errors.area_longitude?.message}
                />
                <Input
                  label="Area Latitude"
                  placeholder="area latitude"
                  {...register('area_latitude')}
                  readOnly
                  error={errors.area_latitude?.message}
                />
                <Textarea
                  label="Comments"
                  placeholder="comments"
                  className="col-span-full"
                  {...register('comments')}
                  readOnly
                  error={errors.comments?.message}
                />
              </FormGroup>
              <FormGroup
                title={'Upload promotion image'}
                description={'Upload your product image gallery here'}
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <UploadZone
                  name="images"
                  getValues={getValues}
                  setValue={setValue}
                  className="col-span-full"
                />
              </FormGroup>
              <FormGroup
                title="Upload promotion document"
                description="Upload your promotion document here"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <UploadZone
                  name="document"
                  getValues={getValues}
                  setValue={setValue}
                  className="col-span-full"
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
              Update promotion
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}
