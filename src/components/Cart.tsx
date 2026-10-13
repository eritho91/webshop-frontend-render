import type { CartItem } from "../types/product-cart";

//cart måste få en prop som heter items vilket måste vara en CartItem lista
type CartProps = {
  items: CartItem[];
  onIncrease: (productId: number) => void;
  onDecrease: (productId: number) => void;
  onCheckout: () => void;
};

//{items} så att listan kan användas
//p taggen går igenom kundvagnen,visar produktsnamn
//key har id och index för react vill ha unikt key värde, ändras i FE-16
function Cart({ items, onIncrease, onDecrease, onCheckout }: CartProps) {
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  return (
    <section className="cart">
      <h2>I kundvagnen</h2>
      {/* Om kundvagnen är tom visas '0'*/}
      {items.length === 0 && <p>Din kundvagn är tom.</p>}

      <div className="cart-items">
        {items.map((item) => (
          <div className="cart-item" key={item.id}>
            <p>{item.name}</p>
            <p>{item.price} kr</p>
            <p>Radpris: {item.price * item.quantity} kr</p>

            <button
              className="quantity-button"
              onClick={() => onDecrease(item.id)}
            >
              -
            </button>
            <span> {item.quantity} </span>
            <button
              className="quantity-button"
              onClick={() => onIncrease(item.id)}
              disabled={item.quantity >= item.stock}
            >
              +
            </button>
          </div>
        ))}
      </div>
      <p>Totalt: {totalPrice} kr</p>
      <button className="primary-button" onClick={onCheckout}>
        Skicka beställning
      </button>
    </section>
  );
}

export default Cart;
