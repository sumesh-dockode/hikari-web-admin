'use client';

import { useState, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from 'rizzui';
import { PiPlusBold } from 'react-icons/pi';
import FormGroup from '@/app/shared/form-group';
import cn from '@core/utils/class-names';

interface ProductMultipleMediaProps {
  className?: string;
}

export default function ProductMultipleMedia({ className }: ProductMultipleMediaProps) {
  const { getValues, setValue } = useFormContext();
  const [images, setImages] = useState<File[]>(getValues('productImages') || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = [...images, ...Array.from(files)];
    setImages(newImages);
    setValue('productImages', newImages);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <FormGroup
      title="Upload product images"
      description="Click the + button to upload images"
      className={cn(className)}
    >
      <div className="grid grid-cols-4 gap-4">
        {images.map((file, index) => (
          <div
            key={index}
            className="aspect-square w-full overflow-hidden rounded-lg border bg-gray-100"
          >
            <img
              src={URL.createObjectURL(file)}
              alt={`Product image ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={triggerFileInput}
          className="flex aspect-square w-full items-center justify-center rounded-lg border border-dashed bg-white hover:border-gray-400"
        >
          <PiPlusBold className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      <input
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleImageChange}
      />
    </FormGroup>
  );
}
