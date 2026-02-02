'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useForm, useFieldArray, SubmitHandler, Controller, useWatch, Control } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

const specificationSchema = z.object({
  name: z.string().min(1, 'Spec name is required'),
  value: z.string().min(1, 'Spec value is required'),
});

const productSectionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  label: z.string().min(1, 'Title is required'), 
  description: z.string().optional(),
price: z.coerce
  .number({ invalid_type_error: 'Price must be a number' })
  .min(1, 'Price is required')
  .max(10_000_000_000, 'Price cannot exceed 10 digits'),

image: z
  .instanceof(File, { message: 'Image is required' })
  .refine((file) => file.size > 0, 'Image is required'),
  specifications: z.array(specificationSchema),
});

const formSchema = z.object({
  products: z.array(productSectionSchema),
});

type FormValues = z.infer<typeof formSchema>;

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string); 
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};


export default function AddProductPopup() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      products: [
        {
          name: '',
          label: '',
          description: '',
          price: 0,
          image: undefined as unknown as File,
          specifications: [{ name: '', value: '' }],
        },
      ],
    },
  });

  const { fields: productFields, append: appendProduct, remove: removeProduct } = useFieldArray({
    control,
    name: 'products',
  });

  useEffect(() => {
    if (open) {
        setTimeout(() => setAnimate(true), 10);
    }
    else {
        setAnimate(false);
        reset(); // Reset form when closed
    } 
  }, [open, reset]);

  const handleClose = () => {
    setAnimate(false);
    setTimeout(() => setOpen(false), 200);
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem('access');
      if (!accessToken) {
        toast('Access token missing');
        return;
      }

      for (let i = 0; i < data.products.length; i++) {
        const p = data.products[i];

        let imageBase64: string | null = null;
        if (p.image instanceof File) {
          imageBase64 = await fileToBase64(p.image);
        }

        const cleanSpecs = (p.specifications || [])
          .filter((s) => s.name?.trim() !== '' && s.value?.trim() !== '')
          .map((s) => ({
            name: s.name.trim(),
            value: s.value.trim(),
          }));

        const payload = {
          title: p.name,
          sub_title: p.label,
          description: p.description,
          price: String(p.price),
          image: imageBase64,
          specifications: cleanSpecs, 
        };

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ecom/admin/product-items/`,
          {
            method: 'POST',
            headers: {
              "Authorization": `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload as any),
          }
        );

        const responseData = await res.json().catch(() => null)as any;

        console.log('STATUS:', res.status);
        console.log('RESPONSE:', responseData);

        if (!res.ok) {
          toast(String(responseData?.message) || `Create failed for product ${i + 1}`);
    
          return;
        }
      }

      toast('Created successfully');
      setOpen(false); // Close will trigger reset via effect if needed, or we can explicit reset
      reset();

      router.refresh();
    } catch (err) {
      console.log('Submit error:', err);
      toast('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-200';
  const errorInputClass = 'border-red-500 ring-1 ring-red-200';

  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-secondary1 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pink-600 transition"
      >
        + Add Products
      </button>

      {open && (
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 transition-opacity duration-200 ${
            animate ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleClose}
        >
          <div
            className={`w-full max-w-[850px] rounded-2xl bg-white shadow-xl transform transition-all duration-200 ${
              animate ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Add Products
                </h2>
                <p className="text-sm text-gray-500">
                  Click + Add to create multiple product sections.
                </p>
              </div>

              <button
                onClick={handleClose}
                className="h-9 w-9 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit(onSubmit as any)} className="flex flex-col h-full max-h-[85vh]">
            <div className="px-6 py-5 space-y-6 overflow-y-auto custom-scrollbar flex-1">
               {/* Button to add product section - previously commented out, keeping logic ready if needed */}
               <div className="flex justify-end">
                {/* <button
                  type="button"
                  onClick={() => appendProduct({
                      name: '',
                      label: '',
                      description: '',
                      price: '',
                      image: null,
                      specifications: [{ name: '', value: '' }],
                  })}
                  className="flex items-center gap-2 rounded-full bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-pink-600 transition"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-pink-500 font-bold">
                    +
                  </span>
                  Add Product Section
                </button> */}
              </div>

              {productFields.map((field, productIndex) => (
                <div
                  key={field.id}
                  className="rounded-2xl border border-gray-200 p-5 space-y-5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800">
                      Product Section {productIndex + 1}
                    </h3>

                    {productFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProduct(productIndex)}
                        className="text-xs font-medium text-red-500 hover:text-red-600"
                      >
                        Remove Section
                      </button>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Name</label>
                    <input
                      {...register(`products.${productIndex}.name`)}
                      className={`${inputClass} ${errors.products?.[productIndex]?.name ? errorInputClass : ''}`}
                      placeholder="Enter product name"
                    />
                    {errors.products?.[productIndex]?.name && (
                        <p className="text-red-500 text-xs mt-1">{errors.products[productIndex]?.name?.message}</p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Title</label>
                    <input
                      {...register(`products.${productIndex}.label`)}
                      className={`${inputClass} ${errors.products?.[productIndex]?.label ? errorInputClass : ''}`}
                      placeholder="Enter product label"
                    />
                     {errors.products?.[productIndex]?.label && (
                        <p className="text-red-500 text-xs mt-1">{errors.products[productIndex]?.label?.message}</p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                      rows={3}
                      {...register(`products.${productIndex}.description`)}
                      className={`${inputClass} ${errors.products?.[productIndex]?.description ? errorInputClass : ''}`}
                      placeholder="Enter product description"
                    />
                    {errors.products?.[productIndex]?.description && (
                        <p className="text-red-500 text-xs mt-1">{errors.products[productIndex]?.description?.message}</p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Price</label>
                    <input
                      {...register(`products.${productIndex}.price`)}
                      className={`${inputClass} ${errors.products?.[productIndex]?.price ? errorInputClass : ''}`}
                      placeholder="0.00"
                    />
                     {errors.products?.[productIndex]?.price && (
                        <p className="text-red-500 text-xs mt-1">{errors.products[productIndex]?.price?.message}</p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full text-sm"
                      onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setValue(`products.${productIndex}.image`, file as any); 
                      }}
                    />
                  </div>

                  {/* Specs */}
                  <div className="space-y-4">
                     <SpecificationsArray control={control as any} productIndex={productIndex} register={register} errors={errors} labelClass={labelClass} inputClass={inputClass} errorInputClass={errorInputClass} />
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex gap-3 border-t px-6 py-4">
              <button
                type="button"
                disabled={loading}
                onClick={handleClose}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-pink-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-pink-600 transition disabled:opacity-60"
              >
                {loading ? 'Submitting...' : 'Submit All'}
              </button>
            </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Separate component to handle nested field array cleanly
function SpecificationsArray({ control, productIndex, register, errors, labelClass, inputClass, errorInputClass }: {
    control: Control<FormValues>;
    productIndex: number;
    register: any;
    errors: any;
    labelClass: string;
    inputClass: string;
    errorInputClass: string;
}) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `products.${productIndex}.specifications`,
    });

    return (
        <>
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-800">
                    Specifications
                </h4>

                <button
                    type="button"
                    onClick={() => append({ name: '', value: '' })}
                    className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 transition"
                >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-700 font-bold border">
                        +
                    </span>
                    Add Spec
                </button>
            </div>

            {fields.map((spec, specIndex) => (
                <div
                    key={spec.id}
                    className="rounded-xl border border-gray-200 p-4 space-y-4"
                >
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-700">
                            Spec {specIndex + 1}
                        </p>

                        {fields.length > 1 && (
                            <button
                                type="button"
                                onClick={() => remove(specIndex)}
                                className="text-xs font-medium text-red-500 hover:text-red-600"
                            >
                                Remove
                            </button>
                        )}
                    </div>

                    <div>
                        <label className={labelClass}>Title</label>
                        <input
                            {...register(`products.${productIndex}.specifications.${specIndex}.name`)}
                            className={`${inputClass} ${errors.products?.[productIndex]?.specifications?.[specIndex]?.name ? errorInputClass : ''}`}
                            placeholder="Enter title"
                        />
                         {errors.products?.[productIndex]?.specifications?.[specIndex]?.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.products[productIndex]?.specifications[specIndex]?.name?.message}</p>
                        )}
                    </div>

                    <div>
                        <label className={labelClass}>Description</label>
                        <input
                            {...register(`products.${productIndex}.specifications.${specIndex}.value`)}
                            className={`${inputClass} ${errors.products?.[productIndex]?.specifications?.[specIndex]?.value ? errorInputClass : ''}`}
                            placeholder="Enter description"
                        />
                         {errors.products?.[productIndex]?.specifications?.[specIndex]?.value && (
                            <p className="text-red-500 text-xs mt-1">{errors.products[productIndex]?.specifications[specIndex]?.value?.message}</p>
                        )}
                    </div>
                </div>
            ))}
        </>
    );
}
