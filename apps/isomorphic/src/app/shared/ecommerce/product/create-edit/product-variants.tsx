'use client';

import { useEffect, useState } from 'react';
import {
  Input,
  Button,
  Select,
  Modal,
  Tooltip,
  ActionIcon,
  SelectOption,
  Switch,
} from 'rizzui';
import { PiMinusBold, PiPlusBold, PiTrashBold } from 'react-icons/pi';
import cn from '@core/utils/class-names';
import FormGroup from '@/app/shared/form-group';
import useVariants from '@/hooks/products/variants/useVariants';
import useVariantValue from '@/hooks/products/variantValues/useVariantValue';
import ProductMultipleMedia from './product-multiple-media';
import {
  VariantFormInput,
  variantSchema,
} from '@/validators/create-variant-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useCreateProductVariant } from '@/hooks/products/productVariant/useCreateProductVariant';
import { useProductsById } from '@/hooks/products/useProductsById';
import { toCurrency } from '@core/utils/to-currency';
import { useQueryClient } from '@tanstack/react-query';
import DeletePopover from '@core/components/delete-popover';
import { useDeleteProductVariant } from '@/hooks/products/productVariant/useDeleteProductVariant';
import PencilIcon from '@core/components/icons/pencil';
import { useProductVariantById } from '@/hooks/products/productVariant/useProductVariantsById';
import { useUpdateProductVariant } from '@/hooks/products/productVariant/useUpdateProductVariant';
import {
  UploadProductImagesProps,
  useUploadProductImages,
} from '@/hooks/products/useUploadProductImages';
import { useDeleteProductImages } from '@/hooks/products/useDeleteUploadedImages';
import toast from 'react-hot-toast';
import { Checkbox, CheckboxGroup } from 'rizzui';
import StoreManagerSelectionField from '@/app/shared/store-manager-selection-field';
import { useStorePricesByVariant } from '@/hooks/products/productVariant/useStorePricesByVariant';
import { useDeleteStorePrice } from '@/hooks/products/productVariant/useDeleteStorePrice';
import { useCreateStorePrice } from '@/hooks/products/productVariant/useCreateStorePrice';

interface VariantOption {
  value: string;
  label: string;
}

interface VariantValueOption {
  value: string;
  label: string;
  variantId: string;
}

interface CreatedVariant {
  id?: string;
  name: string;
  price: number;
  actual_price?: number | null;
  sku: string;
  value?: string;
  stock?: number;
  attributes?: { name: string; value: string }[];
  is_primary?: boolean;
  images?: any[];
  incentive_type?: string;
  incentive_value?: number;
}

interface ShopCustomPrice {
  shopId: number;
  shopLabel: string;
  price: number;
  offer_price?: number;
}

const incentiveTypeOptions = [
  { value: 'FIXED', label: 'Fixed' },
  { value: 'PERCENTAGE', label: 'Percentage' },
];

export default function ProductVariants({
  className,
  productId,
}: {
  className?: string;
  productId: string;
}) {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([]);
  const [valueOptions, setValueOptions] = useState<VariantValueOption[]>([]);
  const [addedVariantAttributes, setAddedVariantAttributes] = useState([
    { variantId: '', valueId: '' },
  ]);

  const [createdVariants, setCreatedVariants] = useState<CreatedVariant[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );
  const [variantAction, setVariantAction] = useState<string | null>(null);
  const [deletedImages, setDeletedImages] = useState<
    UploadProductImagesProps[]
  >([]);

  const { data: productVariantById } = useProductVariantById(
    variantAction === 'edit' && selectedVariantId
  );
  const { mutate: deleteProductVariant, status: deleteStatus } =
    useDeleteProductVariant();
  const { mutate: createProductVariant, status: createStatus } =
    useCreateProductVariant();
  const { mutate: updateProductVariant, status: updateStatus } =
    useUpdateProductVariant();
  const { mutate: uploadImages, status: uploadStatus } =
    useUploadProductImages();
  const { mutate: deleteProductImage, status: deleteImageStatus } =
    useDeleteProductImages();

  const { data: variantsData } = useVariants();
  const { data: variantValuesData } = useVariantValue();
  const { data: productVariant, isFetching } = useProductsById(productId);

  //custom P

  const [selectedShop, setSelectedShop] = useState<{
    managerId: number;
    label: string;
    storeId: string;
    storeName: string;
  } | undefined>(undefined);
  const [customShopPrice, setCustomShopPrice] = useState<number | ''>('');
  const [customShopOfferPrice, setCustomShopOfferPrice] = useState<number | ''>('');
  const [shopCustomPrices, setShopCustomPrices] = useState<ShopCustomPrice[]>([]);
  const [tempShopPrices, setTempShopPrices] = useState<{
    storeId: string;
    storeName: string;
    price: number;
  }[]>([]);

  //cus api
  const { data: storePrices = [], isLoading: isStorePricesLoading } = useStorePricesByVariant(selectedVariantId || createdVariants[0]?.id);
  const { mutate: deleteStorePrice, isPending: isDeletingStorePrice } = useDeleteStorePrice();
  const { mutate: createStorePrice, isPending: isCreatingStorePrice } = useCreateStorePrice();

  function handleDeleteStorePrice(storePriceId: string) {
    deleteStorePrice(storePriceId);
  }

  useEffect(() => {

    setSelectedShop(undefined);
    setCustomShopPrice('');
    setTempShopPrices([]); // Clear temporary shop prices
  }, [isModalOpen, selectedVariantId]);
  //   const handleShopSelection = (value: string) => {
  //   if (value && !selectedShops.includes(value)) {
  //     setSelectedShops([...selectedShops, value]);
  //   }
  //   };

  //   const handleRemoveShop = (shopToRemove: string) => {
  //   setSelectedShops(selectedShops.filter(shop => shop !== shopToRemove));
  // };

  const {
    control,
    register,
    setValue,
    getValues,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VariantFormInput>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      variants: [{ variantId: '', valueId: '' }],
      price: undefined,
      actual_price: 0,
      // offer_price: 0,
      sku: '',
      stock: 1,
      incentive_type: 'PERCENTAGE',
      incentive_value: 0,
      images: [],
      is_primary: false,
    },
  });

  useEffect(() => {
    if (productVariant?.data?.variants) {
      setCreatedVariants(productVariant.data.variants);
    }
  }, [productVariant]);

  useEffect(() => {
    if (productVariantById && selectedVariantId) {
      const productVariant = productVariantById?.data;
      setValue('is_primary', !!productVariant?.is_primary);
      const addedVariantAttributes =
        productVariant?.attributes?.map((a: any) => {
          const matched = variantValuesData?.data?.find((v: any) => v.id === a);
          return {
            variantId: matched?.attribute,
            valueId: matched?.id,
          };

        }) || [];

      setAddedVariantAttributes(addedVariantAttributes);
      setValue('variants', addedVariantAttributes);
      setValue('id', productVariant?.id);
      setValue('sku', productVariant?.sku);
      setValue('price', productVariant?.price || undefined);
      setValue('actual_price', productVariant?.actual_price || undefined);
      setValue('stock', productVariant?.stock);
      setValue('incentive_type', productVariant?.extras?.incentive_type);
      setValue('incentive_value', productVariant?.extras?.incentive_value);
      setValue('images', productVariant?.images);

      setIsModalOpen(true);
    }
  }, [productVariantById, selectedVariantId, setValue, variantValuesData]);

  useEffect(() => {
    if (!variantValuesData?.data) return;

    const options = variantValuesData.data.map((value: any) => ({
      value: value.id,
      label: value.value,
      variantId: value.attribute,
    }));

    setValueOptions(options);
  }, [variantValuesData]);

  useEffect(() => {
    if (variantsData?.data) {
      const options = variantsData.data.map((variant: any) => ({
        value: variant.id,
        label: variant.name,
      }));
      setVariantOptions(options);
    }
  }, [variantsData]);

  const addNewVariantAttribute = () => {
    const currentVariants = getValues('variants');
    const newIndex = currentVariants.length;

    setValue(`variants.${newIndex}.variantId`, '');
    setValue(`variants.${newIndex}.valueId`, '');

    setAddedVariantAttributes((prev) => [
      ...prev,
      { variantId: '', valueId: '' },
    ]);
  };

  // const {
  //   control,
  //   register,
  //   setValue,
  //   getValues,
  //   reset,
  //   handleSubmit,
  //   watch,
  //   formState: { errors },
  // } = useForm<VariantFormInput>({
  //   resolver: zodResolver(variantSchema),
  //   defaultValues: {
  //     variants: [{ variantId: '', valueId: '' }],
  //     price: 1,
  //     sku: '',
  //     stock: 1,
  //     incentive_type: 'PERCENTAGE',
  //     incentive_value: 0,
  //     images: [],
  //     is_primary: false,
  //   },
  // });

  const onSubmit: SubmitHandler<VariantFormInput> = (formData) => {
    if (formData?.id) {
      updateProductVariant(
        {
          id: formData.id,
          product: productId,
          sku: formData.sku,
          price: formData.price || 0, 
          actual_price: formData.actual_price,
          // offer_price: formData.offer_price,
          stock: formData.stock,
          attributes: formData.variants.map((v) => v.valueId),
          // images: formData.images?.map((i) => ({ image: i })) || [],
          extras: {
            incentive_type: formData.incentive_type,
            incentive_value: formData.incentive_value,
          },
          is_primary: formData.is_primary,
        },
        {
          onSuccess: async ({ data }: any) => {
            toast.success('Variant updated successfully');
            const result = data;
            const variantId = result?.id;

            //calling upload api for each image
            if (formData.images && formData.images.length > 0) {
              const imageUploadPromises = formData.images
                .filter((i) => !i.id)
                .map((image: UploadProductImagesProps) =>
                  uploadImages({
                    image: image.image,
                    product_variant: variantId,
                  })
                );
              await Promise.all(imageUploadPromises);
            }

            //calling delete api for each deleted image
            if (deletedImages && deletedImages.length > 0) {
              const imageDeletePromises = deletedImages
                .filter((i) => i.id)
                .map((image: any) => deleteProductImage(image.id));
              await Promise.all(imageDeletePromises);
            }

            setAddedVariantAttributes([{ variantId: '', valueId: '' }]);
            setSelectedVariantId(null);
            setVariantAction(null);
            const attributes = result?.attributes?.map((a: any) => {
              const matched = variantValuesData?.data?.find(
                (v: any) => v.id === a
              );
              return matched
                ? { value: matched.value, name: matched.attribute_data?.name }
                : null;
            });
            const newVariants = {
              id: variantId,
              name: result?.name,
              price: result?.price,
              actual_price: result?.actual_price,
              sku: result?.sku,
              stock: result?.stock,
              attributes: attributes,
              incentive_type: result?.extras?.incentive_type,
              incentive_value: result?.extras?.incentive_value,
              images: result?.images,
              is_primary: result?.is_primary,
            };

            setCreatedVariants((prev) =>
              prev.map((v) => (v.id === result?.id ? newVariants : v))
            );
            queryClient.invalidateQueries({
              queryKey: ['productVariant', variantId],
            });
            setIsModalOpen(false);
            reset();
          },
        }
      );
    } else {
      createProductVariant(
        {
          id: formData.id,
          product: productId,
          sku: formData.sku,
          price: formData.price || 0, // Don't fallback to actual_price
          actual_price: formData.actual_price,
          offer_price: formData.offer_price,
          stock: formData.stock,
          attributes: formData.variants.map((v) => v.valueId),
          // images: formData.images?.map((i) => ({ image: i })) || [],
          extras: {
            incentive_type: formData.incentive_type,
            incentive_value: formData.incentive_value,
          },
          is_primary: formData.is_primary,
        },
        {
          onSuccess: async ({ data }: any) => {
            toast.success('Variant created successfully');
            const result = data;
            const variantId = result?.id;

            if (formData.images && formData.images.length > 0) {
              const imageUploadPromises = formData.images.map(
                (i: UploadProductImagesProps) =>
                  uploadImages({
                    image: i.image,
                    product_variant: variantId,
                  })
              );
              await Promise.all(imageUploadPromises);
            }

            // Create shop prices from temporary state
            if (tempShopPrices.length > 0) {
              const shopPricePromises = tempShopPrices.map(sp =>
                createStorePrice({
                  variantId,
                  storeId: sp.storeId,
                  price: sp.price
                })
              );

              try {
                await Promise.all(shopPricePromises);
                toast.success('All shop prices added successfully');

                // Make sure to invalidate the store prices query to refresh the data
                queryClient.invalidateQueries({ queryKey: ['storePrices', variantId] });
              } catch (error) {
                console.error('Error creating some shop prices:', error);
                toast.error('Some shop prices could not be added');
              }

              // Clear temporary shop prices
              setTempShopPrices([]);
            }

            setAddedVariantAttributes([{ variantId: '', valueId: '' }]);

            const attributes = result?.attributes?.map((a: any) => {
              const matched = variantValuesData?.data?.find(
                (v: any) => v.id === a
              );
              return matched
                ? { value: matched.value, name: matched.attribute_data?.name }
                : null;
            });
            const newVariants = {
              id: variantId,
              name: result?.name,
              price: result?.price,
              actual_price: result?.actual_price,
              sku: result?.sku,
              stock: result?.stock,
              attributes: attributes,
              incentive_type: result?.extras?.incentive_type,
              incentive_value: result?.extras?.incentive_value,
              images: result?.images,
              is_primary: result?.is_primary,
            };
            setCreatedVariants((prev) => [...prev, newVariants]);
            queryClient.invalidateQueries({
              queryKey: ['productVariant', variantId],
            });
            setIsModalOpen(false);
            reset();
          },
        }
      );
    }
  };

  const handleDeleteVariant = (variantId: string) => {
    setVariantAction('delete');
    setSelectedVariantId(variantId);
    deleteProductVariant(variantId, {
      onSuccess: () => {
        toast.success('Variant deleted successfully');
        setCreatedVariants((prev) => prev.filter((v) => v.id !== variantId));
        setSelectedVariantId(null);
        setVariantAction(null);
      },
      onError: (error) => {
        toast.error('Failed to delete variant. Please try again.');
        console.error('Delete variant error:', error);
        setSelectedVariantId(null);
        setVariantAction(null);
      },
    });
  };

  const removeVariantAttribute = (index: number) => {
    const currentVariants = getValues('variants');

    const updatedVariants = currentVariants.filter((_, i) => i !== index);
    setValue('variants', updatedVariants);

    const updatedFields = addedVariantAttributes.filter((_, i) => i !== index);
    setAddedVariantAttributes(updatedFields);
  };

  return (
    <>
      <FormGroup
        title="Variant Options"
        description="Add your product variants here"
        className={cn(className)}
      >
        {/* <Button
          onClick={() => setIsModalOpen(true)}
          variant="outline"
          className="col-span-full ml-auto w-auto"
        >
          <PiPlusBold className="me-2 h-4 w-4" /> Add Variant
        </Button> */}
        {/* reset the fields */}
        <Button
          onClick={() => {
            reset({
              variants: [{ variantId: '', valueId: '' }],
              price: undefined,
              sku: '',
              stock: 1,
              incentive_type: 'PERCENTAGE',
              incentive_value: 0,
              images: [],
            });
            setAddedVariantAttributes([{ variantId: '', valueId: '' }]);
            setDeletedImages([]); // <-- clears old deleted images if needed
            setSelectedVariantId(null);
            setVariantAction(null);
            setIsModalOpen(true);
          }}
          variant="outline"
          className="col-span-full ml-auto w-auto"
        >
          <PiPlusBold className="me-2 h-4 w-4" /> Add Variant
        </Button>

      </FormGroup>
      {createdVariants.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 text-base font-semibold">Created Variants</h3>
          <div className="overflow-x-auto rounded border">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    Attributes
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    Default Price
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    Offer Price
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    Stock
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    SKU
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    Primary
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {createdVariants.map((v, index) => (
                  <tr key={index} className="border-b even:bg-gray-50">
                    <td className="px-4 py-2">
                      {v.attributes?.map((attr, index) => (
                        <div key={index}>
                          {attr.name} - {attr.value}
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-2">{toCurrency(v.actual_price || 0)}</td>
                    <td className="px-4 py-2">{toCurrency(v.price || 0)}</td>
                    <td className="px-4 py-2">{v.stock}</td>
                    <td className="px-4 py-2">{v.sku}</td>
                    <td className="px-4 py-2">
                      {v.is_primary ? (
                        <span className="inline-block rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                          Primary
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        <Tooltip
                          size="sm"
                          content="Edit Variant"
                          placement="top"
                          color="invert"
                        >
                          <ActionIcon
                            as="span"
                            size="sm"
                            variant="outline"
                            aria-label="Edit Variant"
                            isLoading={isFetching && selectedVariantId === v.id}
                            onClick={() => {
                              setVariantAction('edit');
                              setSelectedVariantId(v.id as string);
                            }}
                          >
                            <PencilIcon className="size-4" />
                          </ActionIcon>
                        </Tooltip>
                        <DeletePopover
                          title="Delete Variant"
                          description="Are you sure you want to delete this variant? This action cannot be undone."
                          onDelete={() => handleDeleteVariant(v.id as string)}
                          isLoading={
                            deleteStatus === 'pending' &&
                            selectedVariantId === v.id
                          }
                          className="z-20"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setSelectedVariantId(null);
          setIsModalOpen(false);
        }}
      >
        <div className="space-y-5 p-4">
          <h2 className="text-lg font-bold">Add New Variant</h2>
          {addedVariantAttributes.map((field, index) => (
            <div key={index} className="grid grid-cols-3 gap-4">
              {/* <Controller
                control={control}
                name={`variants.${index}.variantId`}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={variantOptions}
                    label="Variant Name"
                    className="w-full"
                    getOptionValue={(option) => option.value}
                    displayValue={(selected) =>
                      variantOptions.find((r) => r.value === selected)?.label ??
                      ''
                    }
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              /> */}
              {/* <Controller
                control={control}
                name={`variants.${index}.variantId`}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={variantOptions.filter((opt) => {
                    
                      const selectedIds = watch('variants')?.map((v) => v.variantId) || [];
                      const isSelectedInOtherRow = selectedIds.includes(opt.value) &&
                                                  opt.value !== watch(`variants.${index}.variantId`);
                      if (isSelectedInOtherRow) {
                        return false;
                      }
                      if (selectedVariantId) {
                        const isUsedInOtherVariant = createdVariants.some(variant =>
                          variant.id !== selectedVariantId &&
                          variant.attributes?.some(attr =>
                            attr.name === opt.label
                          )
                        );
                        
                        return !isUsedInOtherVariant;
                      } else {
                      
                        const isUsedInExistingVariant = createdVariants.some(variant => 
                          variant.attributes?.some(attr => 
                            attr.name === opt.label
                          )
                        );
                        
                        return !isUsedInExistingVariant;
                      }
                    })}
                    label="Variant Name"
                    className="w-full"
                    getOptionValue={(option) => option.value}
                    displayValue={(selected) =>
                      variantOptions.find((r) => r.value === selected)?.label ??
                      ''
                    }
                    onChange={(value) => {
                      field.onChange(value);
                    
                      setValue(`variants.${index}.valueId`, '');
                    }}
                  />
                )}
              /> */}
              <Controller
                control={control}
                name={`variants.${index}.variantId`}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={variantOptions.filter((opt) => {

                      const selectedIds = watch('variants')?.map((v) => v.variantId) || [];
                      const isSelectedInOtherRow = selectedIds.includes(opt.value) &&
                        opt.value !== watch(`variants.${index}.variantId`);


                      return !isSelectedInOtherRow;
                    })}
                    label="Variant Name"
                    className="w-full"
                    getOptionValue={(option) => option.value}
                    displayValue={(selected) =>
                      variantOptions.find((r) => r.value === selected)?.label ??
                      ''
                    }
                    onChange={(value) => {
                      field.onChange(value);
                      setValue(`variants.${index}.valueId`, '');
                    }}
                  />
                )}
              />
              <Controller
                control={control}
                name={`variants.${index}.valueId`}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={valueOptions.filter(
                      (opt) =>
                        opt.variantId === watch(`variants.${index}.variantId`)
                    )}
                    label="Variant Value"
                    className="w-full"
                    getOptionValue={(option) => option.value}
                    displayValue={(selected) =>
                      valueOptions.find((r) => r.value === selected)?.label ??
                      ''
                    }
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />
              {/* {index === addedVariantAttributes.length - 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addNewVariantAttribute}
                  className="mt-6 text-sm"
                >
                  <PiPlusBold className="h-6 w-4" />
                </Button>
              ) : ( */}
              <Button
                type="button"
                variant="outline"
                color="danger"
                onClick={() => removeVariantAttribute(index)}
                className="mt-6 text-sm text-red-500"
              >
                <PiMinusBold className="h-6 w-4" />
              </Button>
              {/* )} */}
              {errors.variants?.[index] && (
                <p className="col-span-3 text-sm text-red-500">
                  {errors.variants[index]?.variantId?.message ||
                    errors.variants[index]?.valueId?.message}
                </p>
              )}
            </div>
          ))}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Set as Primary Variant
            </label>
            <Controller
              control={control}
              name="is_primary"
              render={({ field }) => (
                <Switch
                  checked={!!field.value} // Convert to boolean with !!
                  onChange={field.onChange}
                  label={field.value ? 'Primary' : 'Not Primary'}
                />
              )}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={addNewVariantAttribute}
            className="mt-6 w-full text-sm"
          >
            <PiPlusBold className="h-6 w-4" />
          </Button>
          <ProductMultipleMedia
            name="images"
            getValues={getValues}
            setValue={setValue}
            deletedImages={deletedImages}
            setDeletedImages={setDeletedImages}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Default Price</label>
              <Input
                type="number"
                placeholder="Enter default price"
                onFocus={(e) => e.target.select()}
                {...register('actual_price', {
                  valueAsNumber: true,
                  setValueAs: (v) => v === '' ? undefined : Number(v)
                })}
              />
              {errors.actual_price && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.actual_price.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Offer Price</label>
              <Input
                type="number"
                placeholder="Enter offer price"
                onFocus={(e) => e.target.select()}
                {...register('price', {
                  setValueAs: (v) => v === '' || v === null || v === undefined ? undefined : Number(v)
                })}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">SKU</label>
              <Input
                type="text"
                placeholder="Enter SKU"
                onFocus={(e) => e.target.select()}
                {...register('sku')}
              />
              {errors.sku && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.sku.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Stock</label>
              <Input
                type="number"
                placeholder="Enter Stock"
                onFocus={(e) => e.target.select()}
                {...register('stock', { valueAsNumber: true })}
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.stock.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Incentive Type
              </label>
              <Select
                options={incentiveTypeOptions}
                className="w-full"
                getOptionValue={(option) => option.value}
                displayValue={(selected) =>
                  incentiveTypeOptions.find(
                    (r: SelectOption) => r.value === selected
                  )?.label ?? ''
                }
                value={watch('incentive_type') ?? ''}
                onChange={(value: string) => setValue('incentive_type', value)}
              />
              {errors.incentive_type && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.incentive_type.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Incentive Value
              </label>
              <Input
                type="number"
                placeholder="Enter Incentive Value"
                onFocus={(e) => e.target.select()}
                {...register('incentive_value', { valueAsNumber: true })}
              />
              {errors.incentive_value && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.incentive_value.message}
                </p>
              )}
            </div>

            <div className="col-span-2 mt-4">
              <h3 className="mb-2 text-base font-semibold">Custom Price</h3>
              <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <label className="text-sm font-medium text-gray-700">Select Shop</label>
                  <StoreManagerSelectionField
                    value={selectedShop ? selectedShop.managerId : 0}
                    onChange={(managerId, managerName, storeInfo) => {
                      console.log('Store manager selected:', { managerId, managerName, storeInfo });

                      if (storeInfo && storeInfo.id) {
                        setSelectedShop({
                          managerId,
                          label: managerName ?? '',
                          storeId: storeInfo.id,
                          storeName: storeInfo.name,
                        });
                      } else {
                        toast.error('This store manager does not have an associated store');
                        setSelectedShop(undefined);
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Price</label>
                  <Input
                    type="number"
                    placeholder="Enter price"
                    value={customShopPrice}
                    onChange={(e) => setCustomShopPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    onFocus={(e) => e.target.select()}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-auto"
                  isLoading={isCreatingStorePrice}
                  onClick={() => {

                    const variantId = selectedVariantId || null;

                    // Validate inputs
                    if (!selectedShop) {
                      toast.error('Please select a store manager');
                      return;
                    }

                    if (!selectedShop.storeId) {
                      toast.error('The selected store manager does not have a valid store. Please select another store manager.');
                      return;
                    }

                    if (customShopPrice === '' || Number(customShopPrice) <= 0) {
                      toast.error('Please enter a valid price');
                      return;
                    }



                    if (variantId) {
                      createStorePrice(
                        {
                          variantId,
                          storeId: selectedShop.storeId,
                          price: Number(customShopPrice),
                        },
                        {
                          onSuccess: (data) => {
                            setSelectedShop(undefined);
                            setCustomShopPrice('');
                            toast.success('Store price added successfully');
                          },
                          onError: (error: any) => {
                            const errorMessage = error?.response?.data?.message || 'Failed to add store price';
                            toast.error(errorMessage);
                          }
                        }
                      );
                    } else {

                      setTempShopPrices([
                        ...tempShopPrices,
                        {
                          storeId: selectedShop.storeId,
                          storeName: selectedShop.storeName,
                          price: Number(customShopPrice)
                        }
                      ]);
                      setSelectedShop(undefined);
                      setCustomShopPrice('');
                      toast.success('Store price added to queue');
                    }
                  }}
                >
                  + Add
                </Button>
              </div>

              {isStorePricesLoading ? (
                <div>Loading...</div>
              ) : (
                selectedVariantId && storePrices.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Added Shops</h4>
                    <div className="overflow-x-auto rounded border">
                      <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left font-medium text-gray-600">Shop</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-600">Price</th>
                            <th className="px-4 py-2 w-16"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {storePrices.map((sp: any) => (
                            <tr key={sp.id} className="border-b even:bg-gray-50">
                              <td className="px-4 py-2">{sp.store?.name}</td>
                              <td className="px-4 py-2">{sp.price}</td>
                              <td className="px-4 py-2 text-right">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="text"
                                  className="text-red-500 p-0"
                                  onClick={() => handleDeleteStorePrice(sp.id)}
                                >
                                  <PiTrashBold className="w-5 h-5" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              )}

              {!selectedVariantId && tempShopPrices.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Added Shops</h4>
                  <div className="overflow-x-auto rounded border">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-gray-600">Shop</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-600">Price</th>
                          <th className="px-4 py-2 w-16"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {tempShopPrices.map((sp, index) => (
                          <tr key={index} className="border-b even:bg-gray-50">
                            <td className="px-4 py-2">{sp.storeName}</td>
                            <td className="px-4 py-2">{sp.price}</td>
                            <td className="px-4 py-2 text-right">
                              <Button
                                type="button"
                                size="sm"
                                variant="text"
                                className="text-red-500 p-0"
                                onClick={() => {
                                  const updatedPrices = [...tempShopPrices];
                                  updatedPrices.splice(index, 1);
                                  setTempShopPrices(updatedPrices);
                                }}
                              >
                                <PiTrashBold className="w-5 h-5" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setAddedVariantAttributes([{ variantId: '', valueId: '' }]);
                setSelectedVariantId(null);
                setIsModalOpen(false);
              }}
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              isLoading={
                createStatus === 'pending' ||
                updateStatus === 'pending' ||
                uploadStatus === 'pending'
              }
              onClick={(e) => {
                e.stopPropagation();
                handleSubmit(onSubmit)();
              }}
            >
              Save Variant
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
