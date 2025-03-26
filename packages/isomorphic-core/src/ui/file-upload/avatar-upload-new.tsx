"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { PiPencilSimple } from "react-icons/pi";
import cn from "../../utils/class-names";
import UploadIcon from "../../components/shape/upload";
import { FieldError, Text } from "rizzui";
import { Path, UseFormSetValue, UseFormGetValues } from "react-hook-form";

interface ImageFile {
  url: string;
  name: string;
  size: number;
}

interface UploadZoneProps<T extends Record<string, any>> {
  name: Path<T>; // 🔹 Ensuring compatibility with React Hook Form
  setValue: UseFormSetValue<T>;
  getValues: UseFormGetValues<T>;
  className?: string;
  error?: string;
}

export default function AvatarUploadNew<T extends Record<string, any>>({
  name,
  setValue,
  getValues,
  className,
  error,
}: UploadZoneProps<T>) {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    // Load the image from React Hook Form (if it exists)
    const formValue = getValues(name) as ImageFile | undefined;
    if (formValue?.url) {
      setImage(formValue.url);
    } else {
      setImage(null);
    }
  }, [getValues, name]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setValue(name, {
        url: imageUrl,
        name: file.name,
        size: file.size,
      } as any);
    }
  };

  return (
    <div className={cn("grid gap-5", className)}>
      <div className="relative grid h-40 w-40 place-content-center rounded-full border-[1.8px]">
        {image ? (
          <>
            <figure className="absolute inset-0 rounded-full">
              <Image
                fill
                objectFit="cover"
                alt="user avatar"
                src={image}
                className="rounded-full object-cover"
              />
            </figure>
            <label
              htmlFor={name}
              className="absolute inset-0 grid cursor-pointer place-content-center rounded-full bg-black/30"
            >
              <PiPencilSimple className="h-5 w-5 text-white" />
            </label>
          </>
        ) : (
          <label
            htmlFor={name}
            className="absolute inset-0 z-10 grid cursor-pointer place-content-center"
          >
            <UploadIcon className="mx-auto h-12 w-12" />
            <Text className="font-medium">Select an image</Text>
          </label>
        )}
        <input
          id={name}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
      {error && <FieldError error={error} />}
    </div>
  );
}
