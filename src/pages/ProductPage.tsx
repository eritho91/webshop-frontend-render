import { useEffect, useState } from "react";
import type { CartItem, Product } from "../types/product-cart";
import { getProducts } from "../service/productService";
import ProductCard from "../components/ProductCard";
import Cart from "../components/Cart";

type ProductPageProps = {
  cartItems: CartItem[];
  onAddToCart: (product: Product) => void;
  onIncreaseQuantity: (productId: number) => void;
  onDecreaseQuantity: (productId: number) => void;
  onCheckout: () => Promise<void>;
};

function ProductPage({
  cartItems,
  onAddToCart,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onCheckout,

}: ProductPageProps) {

  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  //innehåller vagnens produkter + för att ändra. innehåller en lista av items

  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error: any) {
        setError(error.message);
      }
    }

    loadProducts();
  }, []);

  return (
    <main className="product-page">
      <div className="product-page-header">
        <div>
          <h1>Produkter</h1>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowCart(!showCart)}
        >
          {showCart ? "Dölj kundvagn" : "Visa kundvagn"}
        </button>
      </div>
      
      {showCart && (
        <Cart 
          items={cartItems}
          onIncreaseQuantity={onIncreaseQuantity}
          onDecreaseQuantity={onDecreaseQuantity}
          onCheckout={onCheckout}
          />
      )}

      {error && <p>{error}</p>}

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard 
          key={product.id} 
          product={product} 
          onAdd={onAddToCart} 
          />
        ))}
      </div>
    </main>
  );
}

export default ProductPage;
