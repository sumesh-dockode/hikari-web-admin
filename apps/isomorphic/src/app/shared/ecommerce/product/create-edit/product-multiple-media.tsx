'use client';

import { useState, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button, } from 'rizzui';
import { PiPlusBold, PiTrashBold, PiXBold } from 'react-icons/pi';
import FormGroup from '@/app/shared/form-group';
import cn from '@core/utils/class-names';
import { convertToBase64 } from '@core/utils/image-to-base64';
import { UploadProductImagesProps } from '@/hooks/products/useUploadProductImages';
import toast from 'react-hot-toast';

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
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
  
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  
   
    const validFiles = Array.from(fileList).filter(file => {
      if (!validImageTypes.includes(file.type)) {
        toast.error(`Invalid file type. Please upload JPEG, PNG, or WebP.`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File too large. Must be less than 2MB.`);
        return false;
      }
      return true;
    });
  
    if (validFiles.length === 0) return;
  
    try {
      
      const newImagePromises = validFiles.map(async (file) => {
        const imageUrl = await convertToBase64(file);
        return { image: imageUrl };
      });
  
      const newImages = await Promise.all(newImagePromises);
      const updatedImages = [...images, ...newImages];
      
      setImages(updatedImages);
      setValue(name, updatedImages);
    } catch (error) {
      console.error('Error processing images:', error);
      toast.error('Failed to process some images. Please try again.');
    }
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
