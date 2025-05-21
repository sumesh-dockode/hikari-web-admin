"use client";

import Image from "next/image";
import isEmpty from "lodash/isEmpty";
import prettyBytes from "pretty-bytes";
import { useCallback, useState } from "react";
import { useDropzone, Accept } from "react-dropzone";
import { PiArrowsOutSimple, PiFilePdfLight, PiTrashBold } from "react-icons/pi";
import { Button, Text, FieldError } from "rizzui";
import cn from "../../utils/class-names";
import UploadIcon from "../../components/shape/upload";
import { convertToBase64 } from "@core/utils/image-to-base64";
import { Modal } from "@core/modal-views/modal";

interface UploadZoneProps {
  label?: string;
  name: string;
  className?: string;
  error?: string;
  getValues: any;
  setValue: any;
  watch?: any;
  acceptedTypes?: Accept;
}

interface FileType {
  name: string;
  url: string;
  size: number;
}

export default function UploadZone({
  label,
  name,
  className,
  error,
  setValue,
  watch,
  acceptedTypes,
}: UploadZoneProps) {
  const files = watch(name) || [];

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles = await Promise.all(
      acceptedFiles.map(async (file) => ({
        name: file.name,
        size: file.size,
        url: await convertToBase64(file),
      }))
    );
    const updatedFiles = [...files, ...newFiles];
    setValue(name, updatedFiles);
  }, []);

  function handleRemoveFile(index: number) {
    const updatedFiles = files.filter((_: any, i: number) => i !== index);
    setValue(name, updatedFiles);
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept:
      acceptedTypes || ({ "image/*": [], "application/pdf": [] } as Accept),
  });

  return (
    <div className={cn("grid @container", className)}>
      {label && (
        <span className="mb-1.5 block font-semibold text-gray-900">
          {label}
        </span>
      )}
      <div className="rounded-md border-[1.8px]">
        <div
          {...getRootProps()}
          className="flex cursor-pointer items-center gap-4 px-6 py-5 transition-all duration-300 justify-center"
        >
          <input {...getInputProps()} />
          <UploadIcon className="h-12 w-12" />
          <Text className="text-base font-medium">Drop or select file</Text>
        </div>
      </div>
      {!isEmpty(files) && (
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fit,_minmax(140px,_1fr))]">
          {files.map((file: FileType, index: number) => {
            const isPDF =
              file?.name?.toLowerCase().endsWith(".pdf") ||
              file?.url?.toLowerCase().endsWith(".pdf");
            if (isPDF) {
              return (
                <div key={`${file.name}-${index}`} className="relative">
                  <MediaPreview
                    name={file.name}
                    url={file.url}
                    size={file.size}
                    deleteClick={() => handleRemoveFile(index)}
                  />
                </div>
              );
            }
            return (
              <div key={`${file.name}-${index}`} className="relative">
                <figure className="group relative h-40 rounded-md bg-gray-50">
                  <MediaPreview name={file.name} url={file.url} />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="absolute right-0 top-0 rounded-full bg-gray-700/70 p-1.5 opacity-20 transition duration-300 hover:bg-red-dark group-hover:opacity-100"
                  >
                    <PiTrashBold className="text-white" />
                  </button>
                </figure>
                <MediaCaption name={file.name} size={file.size} />
              </div>
            );
          })}
        </div>
      )}
      {error && <FieldError error={error} />}
    </div>
  );
}

function MediaPreview({
  name,
  url,
  size,
  deleteClick,
}: {
  name: string;
  url: string;
  size?: number;
  deleteClick?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!url) return null;
  const isPDF =
    name?.toLowerCase().endsWith(".pdf") || url?.toLowerCase().endsWith(".pdf");

  if (isPDF) {
    return (
      <>
        <div className="flex items-center justify-between rounded-md border p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <PiFilePdfLight className="text-red-500 h-6 w-6" />
            <span className="text-sm font-medium text-gray-800 truncate">
              {name}
            </span>
            <span className="text-xs text-gray-500">
              {size && prettyBytes(size)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(true)}
              className="text-gray-600 hover:text-black"
            >
              <PiArrowsOutSimple className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              color="danger"
              onClick={deleteClick}
            >
              <PiTrashBold className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="lg">
          <div className="relative h-[80vh]">
            <object
              data={url}
              type="application/pdf"
              width="100%"
              height="100%"
            >
              <p>
                PDF preview not supported.{" "}
                <a href={url} target="_blank">
                  Open PDF
                </a>
              </p>
            </object>
          </div>
        </Modal>
      </>
    );
  }

  return (
    <Image
      fill
      src={url || ""}
      alt={name}
      className="rounded-md object-contain"
    />
  );
}

function MediaCaption({ name, size }: { name: string; size: number }) {
  return (
    <div className="mt-1 text-xs">
      <p className="break-words font-medium text-gray-700">{name}</p>
      <p className="mt-1 font-mono">{size && prettyBytes(size)}</p>
    </div>
  );
}
export function LoadingSpinner() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 38 38"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          x1="8.042%"
          y1="0%"
          x2="65.682%"
          y2="23.865%"
          id="a"
        >
          <stop
            stopColor="#fff"
            stopOpacity="0"
            offset="0%"
          />
          <stop
            stopColor="#fff"
            stopOpacity=".631"
            offset="63.146%"
          />
          <stop
            stopColor="#fff"
            offset="100%"
          />
        </linearGradient>
      </defs>
      <g
        fill="none"
        fillRule="evenodd"
      >
        <g transform="translate(1 1)">
          <path
            d="M36 18c0-9.94-8.06-18-18-18"
            id="Oval-2"
            stroke="url(#a)"
            strokeWidth="2"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur="0.9s"
              repeatCount="indefinite"
            />
          </path>
          <circle
            fill="#fff"
            cx="36"
            cy="18"
            r="1"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur="0.9s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </g>
    </svg>
  );
}

