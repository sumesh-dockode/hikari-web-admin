'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { SubmitHandler } from 'react-hook-form';
import { Button, Input, Loader, Text, Title } from 'rizzui';
import cn from '@core/utils/class-names';
import { Form } from '@core/ui/form';
import {
  CategoryFormInput,
  categoryFormSchema,
} from '@/validators/create-category.schema';
import UploadZone, { LoadingSpinner } from '@core/ui/file-upload/upload-zone';
import { useCreateCategories } from '@/hooks/categories/useCreateCategories';
import { useCategoryById } from '@/hooks/categories/useCategoryById';
import { useUpdateCategory } from '@/hooks/categories/useUpdateCategory';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { GetImageSize, omit } from '@/utils/utils';
import PageLoader from '../../page-loader';
import { useRouter } from 'next/navigation';
import { routes } from '@/config/routes';

const QuillEditor = dynamic(() => import('@core/ui/quill-editor'), {
  ssr: false,
  loading: () => (
    <div className="col-span-full h-[168px] rounded bg-gray-100" />
  ),
});

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
      className={cn(className, isModalView ? '@5xl:grid @5xl:grid-cols-6' : '')}
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
          isModalView ? 'col-span-4' : ''
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default function CreateCategory({
  categoryId,
  isModalView = true,
}: {
  categoryId?: string;
  isModalView?: boolean;
}) {
  const { push } = useRouter();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const { data, isLoading: isFetching } = useCategoryById(categoryId || '');

  const {
    mutate: createCategories,
    data: categoryData,
    status: createStatus,
  } = useCreateCategories();

  const {
    mutate: updateCategory,
    data: updateResponseData,
    status: updateStatus,
  } = useUpdateCategory();

  const onSubmit: SubmitHandler<CategoryFormInput> = (formData) => {
    setLoading(true);
    let payload = {
      id: categoryId || '',
      name: formData.name || '',
      image: formData.image?.[0]?.url || null,
      icon_image: formData.icon_image?.[0]?.url || null,
      parent: formData.parent || '',
    };

    if (payload.image?.includes('http')) {
      payload = omit(payload, 'image');
    }

    if (payload.icon_image?.includes('http')) {
      payload = omit(payload, 'icon_image');
    }

    categoryId ? updateCategory(payload) : createCategories(payload);
  };

  useEffect(() => {
    if (createStatus === 'pending' || updateStatus === 'pending') return;

    if (
      (createStatus === 'success' && categoryData) ||
      (updateStatus === 'success' && updateResponseData)
    ) {
      toast.success(
        categoryId
          ? 'Category updated successfully'
          : 'Category created successfully'
      );

      setReset({
        name: '',
        image: [],
        icon_image: [],
        parent: '',
      });

      push(routes.eCommerce.categories);

      setLoading(false);
    } else if (createStatus === 'error' || updateStatus === 'error') {
      toast.error('Something went wrong');
      setLoading(false);
    }
  }, [createStatus, updateStatus]);

  useEffect(() => {
    const setImagesWithSize = async () => {
      if (data?.status === 'success') {
        setImageLoading(true);
        const imageUrl = data?.data?.image;
        const iconUrl = data?.data?.icon_image;

        const [imageSize, iconSize] = await Promise.all([
          imageUrl ? GetImageSize(imageUrl) : 0,
          iconUrl ? GetImageSize(iconUrl) : 0,
        ]);

        setImageLoading(false);

        setReset({
          name: data.data.name || '',
          image: imageUrl
            ? [{ url: imageUrl, name: 'image', size: imageSize }]
            : [],
          icon_image: iconUrl
            ? [{ url: iconUrl, name: 'icon_image', size: iconSize }]
            : [],
          parent: data?.data?.parent || '',
        });
      }
    };

    setImagesWithSize();
  }, [data]);

  if (isFetching) return <PageLoader />;

  return (
    <Form<CategoryFormInput>
      validationSchema={categoryFormSchema}
      resetValues={reset}
      onSubmit={onSubmit}
      useFormProps={{
        mode: 'onChange',
        defaultValues: {
          name: '',
          image: [],
          icon_image: [],
          parent: '',
        },
        resolver: zodResolver(categoryFormSchema),
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
                  ? 'gap-8 divide-y divide-dashed divide-gray-200 @2xl:gap-10 @3xl:gap-12 [&>div]:pt-7 first:[&>div]:pt-0 @2xl:[&>div]:pt-9 @3xl:[&>div]:pt-11'
                  : 'gap-5'
              )}
            >
              <HorizontalFormBlockWrapper
                title="Add new category:"
                description="Edit your category information from here"
                isModalView={isModalView}
              >
                <Input
                  label="Category Name"
                  placeholder="category name"
                  {...register('name')}
                  error={errors.name?.message}
                />
              </HorizontalFormBlockWrapper>

              <HorizontalFormBlockWrapper
                title="Upload new thumbnail image"
                description="Upload your product image gallery here"
                isModalView={isModalView}
              >
                <UploadZone
                  name="image"
                  getValues={getValues}
                  setValue={setValue}
                  className="col-span-full"
                />
              </HorizontalFormBlockWrapper>

              <HorizontalFormBlockWrapper
                title="Upload new icon"
                description="Upload your product icon here"
                isModalView={isModalView}
              >
                <UploadZone
                  name="icon_image"
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
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full @xl:w-auto"
            >
              {categoryId ? 'Update' : 'Create'} Category
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}
