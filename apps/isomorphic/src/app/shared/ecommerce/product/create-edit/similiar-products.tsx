'use client';
import FormGroup from '@/app/shared/form-group';
import cn from '@core/utils/class-names';
import { Button } from 'rizzui/button';
import { useState } from 'react';
import { productsDataType } from '@/data/products-data';
import { Modal } from '@core/modal-views/modal';
import ProductsTable from '../product-list/table';
import { PiTrashDuotone } from 'react-icons/pi';
import Image from 'next/image';

interface SimilarProductsProps {
  className?: string;
}

export default function SimilarProducts({ className }: SimilarProductsProps) {
  const [tempSelected, setTempSelected] = useState<productsDataType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<productsDataType[]>(
    []
  );

  const handleAddProducts = (selectedRows: productsDataType[]) => {
    setSelectedProducts(selectedRows);
    setIsModalOpen(false);
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.filter((product) => product.id !== productId)
    );
  };

  return (
    <>
      <FormGroup
        title="Similar Products"
        description="Add your product's similar products here"
        className={cn(className)}
      >
        <Button
          variant="outline"
          className="col-span-full ml-auto w-auto"
          onClick={() => setIsModalOpen(true)}
        >
          Add Product
        </Button>

        {selectedProducts.length > 0 && (
          <div className="col-span-full mt-4">
            <h4 className="mb-2 font-medium">Selected Similar Products:</h4>
            <div className="space-y-3">
              {selectedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                >
                  <div className="flex items-center gap-3">
                    {product.images && (
                      <Image
                        src={product.images}
                        alt={product.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                    )}
                    <div>
                      <h5 className="font-medium">{product.name}</h5>
                      <p className="text-sm text-gray-500">
                        {product.category} • ${product.price}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="text"
                    onClick={() => removeProduct(product.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <PiTrashDuotone className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </FormGroup>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="xl"
        overlayClassName="backdrop-blur"
      >
        <div className="h-[calc(100vh-200px)] overflow-auto">
          <ProductsTable
            pageSize={5}
            hideFooter
            enableRowSelection={true}
            onSelectionChange={(selected) => setTempSelected(selected)}
            classNames={{
              container: 'border-0 shadow-none',
              rowClassName: 'hover:bg-gray-50',
            }}
          />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => handleAddProducts(tempSelected)}
            disabled={tempSelected.length === 0}
          >
            Save Products ({tempSelected.length})
          </Button>
        </div>
      </Modal>
    </>
  );
}
