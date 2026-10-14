import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { CartItem, Product } from "../types/product-cart";
import { getProductById } from "../service/productService";

type ProductDetailPageProps = {
  cartItems: CartItem[];
  onAddToCart: (product: Product) => void;
  onIncreaseQuantity: (productId: number) => void;
  onDecreaseQuantity: (productId: number) => void;
  onCheckout: () => Promise<void>;
};

function ProductDetailPage({
  onAddToCart,
}: ProductDetailPageProps) {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
        setLoading(true);
        setError(null);
        setProduct(null);

      if (!id) {
        setError("Produkt-ID saknas");
        setLoading(false);
        return;
      }

      try {
        const data = await getProductById(Number(id));
        setProduct(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return <p>Laddar produkt...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!product) {
    return <p>Produkten hittades inte.</p>;
  }

  return (
    <main className="product-detail-page">
      <h1>{product.name}</h1>
      <img
        src={product.imageUrl}
        alt={product.name}
        className="product-image"
      />
      <p>{product.description}</p>
      <p>Price: ${product.price} kr</p>
      <p>I lager: {product.stock}</p>

      <button
        type="button"
        onClick={() => onAddToCart(product)}
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? "Slut i lager" : "Lägg i kundvagn"}
      </button>

    </main>
  );
}

export default ProductDetailPage;
