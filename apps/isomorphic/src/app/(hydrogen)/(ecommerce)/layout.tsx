import CartDrawer from '@/app/shared/ecommerce/cart/cart-drawer';
import ErrorBoundaryWrapper from '@/app/shared/error-boundary-wrapper';
// import FloatingCart from '@/app/shared/floating-cart';
import { CartProvider } from '@/store/quick-cart/cart.context';

export default function EcommerceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundaryWrapper>
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
    </ErrorBoundaryWrapper>
  );
}
