'use client';

import { useEffect, useState } from 'react';
import { Button, Input, Modal, Title, Text } from 'rizzui';
import { ProductType } from './products-data';

type EditProductValues = {
  name: string;
  sku: string;
  category: string;
  price: string;
  barcode: string;
  grossweight: number;
  diamondnumbers: number;
  colourstoneweight: number;
  colourstonenumber: number;
  metaltype: string;

  stock: number;
  status: string;
};

export default function EditProductModal({
  isOpen,
  onClose,
  row,
  onSubmit,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  row: ProductType | null;

  onSubmit: (values: EditProductValues) => Promise<void> | void;

  loading: boolean;
}) {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [barcode, setBarcode] = useState('');
  const [grossweight, setGrossweight] = useState<number>(0);
  const [diamondnumbers, setDiamondnumbers] = useState<number>(0);
  const [colourstoneweight, setColourstoneweight] = useState<number>(0);
  const [colourstonenumber, setColourstonenumber] = useState<number>(0);
  const [metaltype, setMetaltype] = useState('');

  
  const [stock, setStock] = useState<number>(0);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (row) {
      setName(row.name || '');
      setSku(row.sku || '');
      setCategory(row.category || '');
      setPrice(String(row.price || '0'));
      setBarcode(String(row.barcode || ''));

      setGrossweight(Number(row.grossweight || 0));
      setDiamondnumbers(Number(row.diamondnumbers || 0));
      setColourstoneweight(Number(row.colourstoneweight || 0));
      setColourstonenumber(Number(row.colourstonenumber || 0));
      setMetaltype(row.metaltype || '');

      setStock(Number(row.stock || 0));
      setStatus(String(row.status || ''));
    }
  }, [row]);

  const handleSubmit = async () => {
    await onSubmit({
      name,
      sku,
      category,
      price,
      barcode,
      grossweight,
      diamondnumbers,
      colourstoneweight,
      colourstonenumber,
      metaltype,
      stock,
      status,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[102] max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="border-b border-gray-200 px-6 py-4">
          <Title as="h3" className="text-lg font-semibold text-gray-900">
            Edit Product
          </Title>
          <Text className="mt-1 text-sm text-gray-500">
            Update product details and save changes.
          </Text>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input label="SKU" value={sku} onChange={(e) => setSku(e.target.value)} />

            <Input
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <Input
              label="Barcode"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
            />

            <Input
              label="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <Input
              label="Metal Type"
              value={metaltype}
              onChange={(e) => setMetaltype(e.target.value)}
            />

            <Input
              label="Gross Weight"
              type="number"
              value={grossweight}
              onChange={(e) => setGrossweight(Number(e.target.value))}
            />

            <Input
              label="Diamond Count"
              type="number"
              value={diamondnumbers}
              onChange={(e) => setDiamondnumbers(Number(e.target.value))}
            />

            <Input
              label="Color Stone Weight"
              type="number"
              value={colourstoneweight}
              onChange={(e) => setColourstoneweight(Number(e.target.value))}
            />

            <Input
              label="Color Stone Number"
              type="number"
              value={colourstonenumber}
              onChange={(e) => setColourstonenumber(Number(e.target.value))}
            />

            {/* ✅ added */}
            <Input
              label="Stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
            />

            <Input
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="min-w-[110px]"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            isLoading={loading}
            className="min-w-[140px] bg-swa hover:bg-sw1"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
