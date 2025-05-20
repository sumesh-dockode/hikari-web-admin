'use client';

import { useState, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from 'rizzui';
import { PiPlusBold } from 'react-icons/pi';
import FormGroup from '@/app/shared/form-group';
import cn from '@core/utils/class-names';
import { convertToBase64 } from '@core/utils/image-to-base64';
import { UploadProductImagesProps } from '@/hooks/products/useUploadProductImages';

interface ProductMultipleMediaProps {
  className?: string;
  name: string;
  getValues: any;
  setValue: any;
}

export default function ProductMultipleMedia({
  className,
  name,
  getValues,
  setValue,
}: ProductMultipleMediaProps) {
  const [images, setImages] = useState<UploadProductImagesProps[]>(
    getValues(name) || []
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files?.[0];
    if (!files) return;
    const imageUrl = await convertToBase64(files);
    const imgObj = {
      image: imageUrl,
    };
    const newImages = [...images, imgObj];
    setImages(newImages);
    setValue(name, newImages);
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
              src={file.image}
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
