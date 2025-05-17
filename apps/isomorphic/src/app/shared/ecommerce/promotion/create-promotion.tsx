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
import { GetImageSize, omit } from '@/utils/utils';
import { useUpdatePromotion } from '@/hooks/promotions/useUpdatePromotion';
import toast from 'react-hot-toast';
import { routes } from '@/config/routes';
import PageLoader from '../../page-loader';

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
  const [imageLoading, setImageLoading] = useState(false);
  const {
    data,
    isLoading: isFetching,
    error: fetchError,
  } = usePromotionById(id || '');
  const {
    mutate: updatePromotion,
    data: updateResponseData,
    status: updateStatus,
  } = useUpdatePromotion();

  useEffect(() => {
    const setImagesWithSize = async () => {
      if (data?.status === 'success') {
        setImageLoading(true);
        const detailData = data?.data;
        const imageUrl = detailData?.promotion_image;
        const documentUrl = detailData?.promotion_document;

        const [imageSize, documentSize] = await Promise.all([
          imageUrl ? GetImageSize(imageUrl) : 0,
          documentUrl ? GetImageSize(documentUrl) : 0,
        ]);

        const resetData = {
          id: detailData?.id || null,
          store_manager: detailData?.store_manager || null,
          product: detailData?.product || null,
          promotion_medium: detailData?.promotion_medium || null,
          aspect_ratio: detailData?.aspect_ratio || null,
          area_latitude: detailData?.area_latitude || null,
          area_longitude: detailData?.area_longitude || null,
          comments: detailData?.comments || null,
          promotion_image: imageUrl
            ? [{ url: imageUrl, name: 'image', size: imageSize }]
            : [],
          promotion_document: documentUrl
            ? [{ url: documentUrl, name: 'image', size: documentSize }]
            : [],
        };
        setReset(resetData);
        setImageLoading(false);
      }
    };

    setImagesWithSize();
  }, [data]);

  const onSubmit: SubmitHandler<PromotionFormInput> = (data) => {
    setLoading(true);
    let payload = {
      ...data,
      id: data.id || (id as string),
      promotion_image: data.promotion_image?.[0]?.url || null,
      promotion_document: data.promotion_document?.[0]?.url || null,
    };

    if (payload.promotion_image?.includes('http')) {
      payload = omit(payload, 'promotion_image');
    }

    if (payload.promotion_document?.includes('http')) {
      payload = omit(payload, 'promotion_document');
    }

    id && updatePromotion(payload);
  };

  useEffect(() => {
    if (updateStatus === 'pending') return;

    if (updateStatus === 'success' && updateResponseData) {
      toast.success('Promotion updated successfully');

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

      push(routes.eCommerce.promotion);

      setLoading(false);
    } else if (updateStatus === 'error') {
      toast.error('Something went wrong');
      setLoading(false);
    }
  }, [updateStatus]);

  if (isFetching || imageLoading) return <PageLoader />;

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
      {({
        register,
        control,
        getValues,
        setValue,
        watch,
        formState: { errors },
      }) => (
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
                  name="promotion_image"
                  getValues={getValues}
                  setValue={setValue}
                  watch={watch}
                  className="col-span-full"
                  error={errors.promotion_image?.message}
                />
              </FormGroup>
              <FormGroup
                title="Upload promotion document"
                description="Upload your promotion document here"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <UploadZone
                  name="promotion_document"
                  getValues={getValues}
                  setValue={setValue}
                  watch={watch}
                  className="col-span-full"
                  error={errors.promotion_document?.message}
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
