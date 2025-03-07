import FormGroup from '@/app/shared/form-group';
import cn from '@core/utils/class-names';
import ProductPricing from '@/app/shared/ecommerce/product/create-edit/product-pricing';
import { Button } from 'rizzui/button';

interface SimiliarProductsProps {
  className?: string;
}

export default function similiarProducts({ className }: SimiliarProductsProps) {
  return (
    <>
      <FormGroup
        title="Similar Products"
        description="Add your product's similar products here"
        className={cn(className)}
      >
        {/* <div className="col-span-full flex gap-4 xl:gap-7">Hello</div> */}
        <Button variant="outline" className="col-span-full ml-auto w-auto">
          Add Product
        </Button>
      </FormGroup>
    </>
  );
}
