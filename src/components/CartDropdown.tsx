import type { CartItem } from "../types/product-cart";
import Cart from "./Cart";

type CartDropdownProps = {
  cartItems: CartItem[];
  onIncrease: (productId: number) => void;
  onDecrease: (productId: number) => void;
  onCheckout: () => void;
};

function CartDropdown({
  cartItems,
  onIncrease,
  onDecrease,
  onCheckout,
}: CartDropdownProps) {
  return (
    <div className="cart-dropdown">
      <Cart
        items={cartItems}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
        onCheckout={onCheckout}
      />
    </div>
  );
}

export default CartDropdown;
