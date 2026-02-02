'use client';
import FormGroup from '@/app/shared/form-group';
import cn from '@core/utils/class-names';
import { Button } from 'rizzui/button';
import { useState } from 'react';
import { productsDataType } from '@/data/products-data';
import { Modal } from '@core/modal-views/modal';
import ProductsTable from '../product2/table';
import { PiTrashDuotone } from 'react-icons/pi';
import usePaginatedProducts from '@/hooks/products/usePaginatedProducts';
import { useFormContext } from 'react-hook-form';
import AvatarCard from '@core/ui/avatar-card';
import { toCurrency } from '@core/utils/to-currency';

interface SimilarProductsProps {
  className?: string;
  productId: string;
}

export default function SimilarProducts({
  className,
  productId,
}: SimilarProductsProps) {
  const { data } = usePaginatedProducts({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState<productsDataType[]>([]);
  // const { mutate: deleteProduct, status: deleteStatus } = useDeleteProducts();
  const { control, setValue, getValues, watch } = useFormContext();
  // const productsList = data?.data || [];
  const similarProducts = watch('similar_products') || [];
  const productsList = (data?.data || []).filter(
    (p: productsDataType) => p.id !== productId
  );

  const selectedProducts = productsList.filter((p: productsDataType) =>
    similarProducts.includes(p.id)
  );
  const handleAddProducts = () => {
    const newIds = tempSelected?.map((p) => p.id) || [];
    const existingIds = watch('similar_products') || [];

    const mergedIds = Array.from(new Set([...existingIds, ...newIds]));

    setValue('similar_products', mergedIds);
    setIsModalOpen(false);
  };

  const removeProduct = (productId: string) => {
    const updated = similarProducts.filter((id: any) => id !== productId);
    setValue('similar_products', updated);
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
          onClick={() => {
            const selected = productsList.filter((p: productsDataType) =>
              similarProducts.includes(p.id)
            );
            setTempSelected(selected); // Sync previous selections
            setIsModalOpen(true);
          }}
        >
          Add Product
        </Button>

        {selectedProducts.length > 0 && (
          <div className="col-span-full mt-4">
            <div className="mb-2">Selected Similar Products:</div>
            <div className="space-y-3">
              {selectedProducts.map((product: productsDataType) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                >
                  <div className="flex items-center gap-3">
                    {product.product_images && (
                      <AvatarCard
                        src={product.product_images?.[0]}
                        name={product.name}
                        description={
                          <span className="flex gap-2">
                            <span className="line-clamp-1 text-sm text-gray-500">
                              {product.description}
                            </span>{' '}
                            |
                            <span className="text-sm text-gray-500">
                              {toCurrency(product.price || 0)}
                            </span>
                          </span>
                        }
                        descriptionClassName="line-clamp-2"
                        avatarProps={{
                          name: product.name,
                          size: 'lg',
                          className: 'rounded-lg',
                        }}
                      />
                    )}
                    {/* <div>
                      <div className="font-medium">{product.name}</div>
                      <p className="text-sm text-gray-500">
                        {product.category} • ${product.price}
                      </p>
                    </div> */}
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
        <div className="h-[calc(100vh-200px)]">
          <div className="h-[calc(100vh-280px)] overflow-auto p-6">
            <ProductsTable
              pageSize={5}
              hideFooter
              enableRowSelection={true}
              initialSelection={similarProducts.filter(
                (id: any) => id !== productId
              )} // remove main product ID
              onSelectionChange={
                (selected: productsDataType[]) =>
                  setTempSelected(selected.filter((p: productsDataType) => p.id !== productId)) // filter out main product
              }
              classNames={{
                container: 'border-0 shadow-none',
                rowClassName: 'hover:bg-gray-50',
              }}
            />
          </div>
          <div className="sticky bottom-0 left-0 right-0 z-10 -mb-8 flex items-center justify-end gap-4 border-t bg-white px-4 py-4 dark:bg-gray-50 md:px-5 lg:px-6 3xl:px-8 4xl:px-10">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddProducts}
              disabled={tempSelected.length === 0}
            >
              Save Products ({tempSelected.length})
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
