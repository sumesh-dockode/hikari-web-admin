'use client';

import { useState } from 'react';
import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import { Button } from 'rizzui/button';
import { PiPlusBold } from 'react-icons/pi';
import { Modal } from '@core/modal-views/modal';
import { Input } from 'rizzui/input';

const pageHeader = {
  title: 'Product Variants',
  breadcrumb: [
    { href: routes.eCommerce.dashboard, name: 'Home' },
    { href: routes.eCommerce.productVariants, name: 'Variants' },
    { name: 'List' },
  ],
};

const COLORS = [
  '#FF0000',
  '#00AEEF',
  '#00FF00',
  '#FFA500',
  '#800080',
  '#000000',
];

export default function ProductVariantsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isValueModalOpen, setIsValueModalOpen] = useState(false);
  const [variantName, setVariantName] = useState('');
  const [variants, setVariants] = useState<
    { name: string; values: string[] }[]
  >([]);
  const [activeVariantIndex, setActiveVariantIndex] = useState<number | null>(
    null
  );
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');

  const handleSaveVariant = () => {
    if (variantName.trim() === '') return;
    setVariants((prev) => [...prev, { name: variantName.trim(), values: [] }]);
    setVariantName('');
    setIsModalOpen(false);
  };

  const openValueModal = (index: number) => {
    setActiveVariantIndex(index);
    setSelectedColor('');
    setInputValue('');
    setIsValueModalOpen(true);
  };

  const handleSaveValue = () => {
    if (activeVariantIndex === null) return;

    const currentVariant = variants[activeVariantIndex];
    const valueToAdd =
      currentVariant.name.toLowerCase() === 'color'
        ? selectedColor
        : inputValue.trim();

    if (!valueToAdd) return;

    const updatedVariants = [...variants];
    updatedVariants[activeVariantIndex].values.push(valueToAdd);
    setVariants(updatedVariants);
    setIsValueModalOpen(false);
  };
  const handleRemoveValue = (variantIndex: number, valueIndex: number) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].values.splice(valueIndex, 1);
    setVariants(updatedVariants);
  };
  const getModalContent = () => {
    const currentVariant = variants[activeVariantIndex ?? 0];
    if (!currentVariant) return null;

    if (currentVariant.name.toLowerCase() === 'color') {
      return (
        <>
          <div className="text-sm font-medium text-gray-700">
            Select a color
          </div>
          <div className="flex flex-wrap gap-3">
            {COLORS.map((color) => (
              <button
                key={color}
                className={`h-10 w-10 rounded-full border-2 ${
                  selectedColor === color
                    ? 'border-gray-800'
                    : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </>
      );
    } else {
      return (
        <Input
          type="text"
          label={`Enter a ${currentVariant.name} value`}
          placeholder={`e.g. Leather, 3-Seater`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      );
    }
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="outline"
            className="col-span-full ml-auto w-auto"
          >
            <PiPlusBold className="me-2 h-4 w-4" /> Add Variant
          </Button>
        </div>
      </PageHeader>

      {/* Add Variant Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="space-y-4 p-6">
          <Input
            type="text"
            label="Enter the variant name"
            placeholder="variant name"
            value={variantName}
            onChange={(e) => setVariantName(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveVariant}>Save Variant</Button>
          </div>
        </div>
      </Modal>

      {/* Add Value Modal */}
      <Modal
        isOpen={isValueModalOpen}
        onClose={() => setIsValueModalOpen(false)}
      >
        <div className="space-y-4 p-6">
          {getModalContent()}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsValueModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveValue}
              disabled={
                variants[activeVariantIndex ?? 0]?.name.toLowerCase() ===
                'color'
                  ? !selectedColor
                  : !inputValue.trim()
              }
            >
              Save Value
            </Button>
          </div>
        </div>
      </Modal>

      {/* Variant List */}
      <div className="mt-8 space-y-4 px-6">
        {variants.map((variant, index) => (
          <div
            key={index}
            className="space-y-2 rounded border border-gray-200 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-800">
                {variant.name}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => openValueModal(index)}
              >
                <PiPlusBold className="me-2 h-4 w-4" /> Add Value
              </Button>
            </div>
            {variant.values.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {variant.values.map((value, idx) => (
                  <div key={idx} className="relative flex items-center">
                    {variant.name.toLowerCase() === 'color' ? (
                      <div
                        className="h-6 w-6 rounded-full border"
                        style={{ backgroundColor: value }}
                        title={value}
                      />
                    ) : (
                      <div className="rounded border bg-gray-100 px-3 py-1 text-xs text-gray-700">
                        {value}
                      </div>
                    )}
                    <button
                      onClick={() => handleRemoveValue(index, idx)}
                      className="ml-1 text-xs text-gray-400 hover:text-red-500"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
