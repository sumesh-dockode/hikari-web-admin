'use client';

import { useEffect, useState, useCallback } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { Input, Button, ActionIcon, Select, Modal } from 'rizzui';
import { PiPlusBold } from 'react-icons/pi';
import cn from '@core/utils/class-names';
import FormGroup from '@/app/shared/form-group';
import TrashIcon from '@core/components/icons/trash';
import SelectLoader from '@core/components/loader/select-loader';
import useVariants from '@/hooks/products/variants/useVariants';
import useVariantValue from '@/hooks/products/variantValues/useVariantValue';
// import { Modal } from '@core/modal-views/modal';

interface VariantOption {
  value: string;
  label: string;
}

interface VariantValueOption {
  value: string;
  label: string;
  variantId: string;
}

export default function ProductVariants({ className }: { className?: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addedVariants, setAddedVariants] = useState<
    { id: string; name: string; value: string }[]
  >([]);

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );
  const [selectedValueId, setSelectedValueId] = useState<string | null>(null);
  const { data: variantsData, isLoading: isVariantsLoading } = useVariants();

  const { data: variantValuesData, isLoading: isValuesLoading } =
    useVariantValue();

  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([]);
  const [valueOptions, setValueOptions] = useState<VariantValueOption[]>([]);

  useEffect(() => {
    if (variantsData?.pages) {
      const options = variantsData.pages.flatMap((page) =>
        page.data.results.map((variant: any) => ({
          value: variant.id,
          label: variant.name,
        }))
      );
      setVariantOptions(options);
    }
  }, [variantsData]);

  useEffect(() => {
    if (variantValuesData?.pages && selectedVariantId) {
      const options = variantValuesData.pages.flatMap((page) =>
        page.data.results.map((value: any) => ({
          value: value.id,
          label: value.value,
          variantId: value.attribute,
        }))
      );
      setValueOptions(options);
    }
  }, [variantValuesData, selectedVariantId]);

  const handleAddVariant = useCallback(() => {
    console.log('Clicked Add Variant', selectedVariantId, selectedValueId); // 👈 debug

    const variantId = selectedVariantId;
    const valueId = selectedValueId;

    const selectedVariant = variantOptions.find(
      (opt) => opt.value === variantId
    );
    const selectedValue = valueOptions.find((opt) => opt.value === valueId);

    if (selectedVariant && selectedValue) {
      setAddedVariants((prev) => [
        ...prev,
        {
          id: `${variantId}-${valueId}`,
          name: selectedVariant.label,
          value: selectedValue.label,
        },
      ]);
      setSelectedVariantId(null);
      setSelectedValueId(null);
      setIsModalOpen(false);
    } else {
      console.warn('Variant or Value not selected properly');
    }
  }, [variantOptions, valueOptions, selectedVariantId, selectedValueId]);

  console.log('variantOptions', variantOptions);

  return (
    <>
      <FormGroup
        title="Variant Options"
        description="Add your product variants here"
        className={cn(className)}
      >
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="outline"
          className="col-span-full ml-auto mt-8 w-auto"
        >
          <PiPlusBold className="me-2 h-4 w-4" /> Add Variant
        </Button>
      </FormGroup>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Variant Name</th>
            <th className="p-2 text-left">Variant Value</th>
          </tr>
        </thead>
        <tbody>
          {addedVariants.map((item) => (
            <tr key={item.id} className="border-t bg-white">
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-4">
          <h2 className="mb-4 text-lg font-bold">Add New Variant</h2>
          <div className="space-y-4">
            {/* <Controller
              name="newVariantName"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  {isVariantsLoading && <SelectLoader />} */}
            <Select
              options={variantOptions}
              value={selectedVariantId}
              onChange={(value) => {
                // field.onChange(value);
                setSelectedVariantId(value as string);
              }}
              label="Variant Name"
              className="w-full"
              getOptionValue={(option) => option.value}
              displayValue={(selected) =>
                variantOptions?.find((r) => r.value === selected)?.label ?? ''
              }
              inPortal={true}
            />
            {/* </div>
              )}
            /> */}

            {/* <Controller
              name="newVariantValue"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  {isValuesLoading && <SelectLoader />} */}
            <Select
              options={valueOptions.filter(
                (opt) => opt.variantId === selectedVariantId
              )}
              value={selectedValueId}
              onChange={(value) => setSelectedValueId(value as string)}
              label="Variant Value"
              className="w-full"
              getOptionValue={(option) => option.value}
              displayValue={(selected) =>
                valueOptions?.find((r) => r.value === selected)?.label ?? ''
              }
            />
            {/* </div> */}
            {/* )}
            /> */}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddVariant}
                // disabled={
                //   !getValues('newVariantName') || !getValues('newVariantValue')
                // }
              >
                Add Variant
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
