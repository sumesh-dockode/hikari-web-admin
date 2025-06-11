'use client';

import { useState, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from 'rizzui';
import { PiPlusBold, PiTrashBold, PiXBold } from 'react-icons/pi';
import FormGroup from '@/app/shared/form-group';
import cn from '@core/utils/class-names';
import { convertToBase64 } from '@core/utils/image-to-base64';
import { UploadProductImagesProps } from '@/hooks/products/useUploadProductImages';

interface ProductMultipleMediaProps {
  className?: string;
  name: string;
  getValues: any;
  setValue: any;
  deletedImages: any;
  setDeletedImages?: any;
}

export default function ProductMultipleMedia({
  className,
  name,
  getValues,
  setValue,
  deletedImages,
  setDeletedImages,
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

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const deleted = images.filter((_, i) => i === index);
    setImages(updatedImages);
    setDeletedImages([...deletedImages, ...deleted]);
    setValue(name, updatedImages);
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
            className="relative aspect-square w-full overflow-hidden rounded-lg border bg-gray-100"
          >
            <img
              src={file.image}
              alt={`Product image ${index + 1}`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute right-1 top-1 rounded-full bg-gray-500/20 p-1.5 transition duration-300 hover:bg-gray-500/40"
            >
              <PiTrashBold className="h-3 w-3 text-red-500" />
            </button>
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
