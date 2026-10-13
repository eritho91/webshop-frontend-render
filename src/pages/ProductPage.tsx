import { useEffect, useState } from "react";
import type { CartItem, Product } from "../types/product-cart";
import { getProducts } from "../service/productService";
import ProductCard from "../components/ProductCard";
import Cart from "../components/Cart";
import { categories } from "../types/category";

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
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);

  //Sätter default category till ALL, så att alla produkter visas vid första renderingen
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  //innehåller texten som användaren skriver i sökfältet
  const [searchTerm, setSearchTerm] = useState("");

  //Lägger till ALL i listan av kategorier
  const categoryOptions = ["ALL", ...categories];

  //trim för att ta bort extra mellanslag och gör till små bokstäver för att kunna jämföra enkelt
  const search = searchTerm.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    //filtrerar genom alla produkter för att se om det ska visas
    const matchCategory =
      selectedCategory === "ALL" || product.category === selectedCategory;

    //kollar om sökordet finns i produktens namn eller beskrivning
    const matchSearch =
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search);

    //returnerar båda filter
    return matchCategory && matchSearch;
  });

  //Hämtar produkter när sidan visas
  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error: unknown) {
        setError(
          error instanceof Error
            ? error.message
            : "Kunde inte hämta produkter.",
        );
      } finally {
        setLoading(false);
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
        type="button"
          className="primary-button"
          onClick={() => setShowCart(!showCart)}
        >
          {showCart ? "Dölj kundvagn" : "Visa kundvagn"}
        </button>
      </div>

      <input
        type="search"
        placeholder="Sök produkter.."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
      <select
        className="category-select"
        value={selectedCategory}
        onChange={(event) => setSelectedCategory(event.target.value)}
      >
        {categoryOptions.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {/* Funktionerna skickas till Cart som props */}
      {showCart && (
        <Cart
          items={cartItems}
          onIncrease={onIncreaseQuantity}
          onDecrease={onDecreaseQuantity}
          onCheckout={onCheckout}
        />
      )}

      {loading && <p>Laddar produkter...</p>}

      {!loading && error && <p>{error}</p>}

      {!loading && !error && filteredProducts.length === 0 && (
        <p>Inga produkter matchade din sökning.</p>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={onAddToCart}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default ProductPage;
