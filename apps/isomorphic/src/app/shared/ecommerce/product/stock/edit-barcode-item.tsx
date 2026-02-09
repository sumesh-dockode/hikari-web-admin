'use client';

import { useEffect, useState } from 'react';
import {
  useForm,
  useFieldArray,
  SubmitHandler,
  Controller,
} from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';


const specificationSchema = z.object({
  name: z.string().min(1, 'Spec name is required'),
  value: z.string().min(1, 'Spec value is required'),
});

const editProductSchema = z.object({
  productItemId: z.string().optional(), // Used internally but not always editable
  name: z.string().min(1, 'Title is required'),
  label: z.string().min(1, 'Label is required'),
  description: z.string().min(1, 'Description is required'),
 price: z.coerce
  .number({ invalid_type_error: 'Price must be a number' })
  .min(1, 'Price is required')
  .max(10_000_000_000, 'Price cannot exceed 10 digits'),

  // keeping as string to match existing logic, could refine validation
  productSku: z.string().optional(),
  variantSku: z.string().optional(),
  specifications: z.array(specificationSchema),
  imageFile: z.any().optional(), // File object or null
});

export type EditProductValues = z.infer<typeof editProductSchema> & {
  productItemId: string; // Ensure this exists for types
};

/* ---------------- TYPES ---------------- */
// Re-exporting inferred type or keeping mostly compatible
type Specification = z.infer<typeof specificationSchema>;

/* ---------------- COMPONENT ---------------- */

export default function EditProductModal({
  isOpen,
  onClose,
  productItemId,
  onSubmit,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  productItemId: string | null;
  onSubmit: (values: EditProductValues) => Promise<void> | void;
  loading: boolean;
}) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EditProductValues>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      name: '',
      label: '',
      description: '',
      price: 0,
      productSku: '',
      variantSku: '',
      specifications: [],
      imageFile: null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'specifications',
  });


  const fetchProductItemById = async (id: string) => {
    const token = localStorage.getItem('access');
    if (!token) throw new Error('Access token missing');

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ecom/admin/product-items/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error('Failed to fetch product items');

    const json = (await res.json()) as any;
    return json.data.find((item: any) => item.id === id);
  };

  useEffect(() => {
    if (!isOpen || !productItemId) return;

    const loadItem = async () => {
      try {
        const item = await fetchProductItemById(productItemId);
        if (!item) return;

        // Reset form with fetched data
        reset({
          productItemId: item.id,
          name: item.product?.name ?? '',
          label: item.product?.label ?? '',
          description: item.product?.description ?? null,
          price: item.product?.price ?? '',
          productSku: item.product?.sku ?? '',
          variantSku: item.sku ?? '',
          specifications: item.product?.specifications ?? [],
          imageFile: null,
        });

        setImagePreview(
          item.image || item.product?.image || item.product_images?.[0] || null
        );
      } catch (err) {
        console.error('Failed to load product item:', err);
      }
    };

    loadItem();
  }, [isOpen, productItemId, reset]);


  const handleImageChange = (file: File | null) => {
    if (!file) return;

    setValue('imageFile', file);
    setImagePreview(URL.createObjectURL(file)); 
  };


  const handleFormSubmit: SubmitHandler<EditProductValues> = async (data) => {
    if (!productItemId) return;

    await onSubmit({
      ...data,
      productItemId,
    });
  };

  /* ---------------- UI ---------------- */

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 ${
        isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div
        className={`w-full max-w-[850px] rounded-2xl bg-white shadow-xl transition-all ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">Edit Product</h2>
            <p className="text-sm text-gray-500">
              Update product details and specifications
            </p>
          </div>

          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit(handleFormSubmit as any)}
          className="flex flex-col"
        >
          <div className="max-h-[70vh] space-y-6 overflow-auto px-6 py-5">
            <div className="space-y-6 rounded-2xl border p-5">
              {/* IMAGE */}
              <div className="flex flex-col items-center gap-3">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Product"
                    className="h-40 w-40 rounded-xl border object-cover"
                  />
                ) : (
                  <div className="flex h-40 w-40 items-center justify-center rounded-xl border border-dashed text-gray-400">
                    No Image
                  </div>
                )}

                <label className="cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200">
                  Change Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleImageChange(e.target.files?.[0] ?? null)
                    }
                  />
                </label>
              </div>

              {/* FORM */}
              <InputField
                label="Title"
                {...register('name')}
                error={errors.name?.message}
              />
              <InputField
                label="Label"
                {...register('label')}
                error={errors.label?.message}
              />
              <TextAreaField
                label="Description"
                {...register('description')}
                error={errors.description?.message}
              />

              <InputField
                label="Price"
                placeholder="0.00"
                {...register('price')}
                error={errors.price?.message}
              />

              {/* SPECS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Specifications</h4>
                  <button
                    type="button"
                    onClick={() => append({ name: '', value: '' })}
                    className="rounded-full bg-gray-100 px-4 py-2 text-sm"
                  >
                    + Add Spec
                  </button>
                </div>

                {fields.map((spec, index) => (
                  <div
                    key={spec.id}
                    className="space-y-3 rounded-xl border p-4"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">Spec {index + 1}</span>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-sm text-red-500"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <InputField
                      label="Title"
                      {...register(`specifications.${index}.name`)}
                      error={errors.specifications?.[index]?.name?.message}
                    />
                    <TextAreaField
                      label="Description"
                      {...register(`specifications.${index}.value`)}
                      error={errors.specifications?.[index]?.value?.message}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 border-t px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-pink-500 py-2 text-white"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

function InputField({ label, error, className, ...props }: InputFieldProps) {
  return (
    <div>
      <label className="mb-1 block text-sm">{label}</label>
      <input
        className={`w-full rounded-lg border px-4 py-2 ${error ? 'border-red-500' : ''} ${className || ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface TextAreaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

function TextAreaField({
  label,
  error,
  className,
  ...props
}: TextAreaFieldProps) {
  return (
    <div>
      <label className="mb-1 block text-sm">{label}</label>
      <textarea
        rows={3}
        className={`w-full rounded-lg border px-4 py-2 ${error ? 'border-red-500' : ''} ${className || ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
