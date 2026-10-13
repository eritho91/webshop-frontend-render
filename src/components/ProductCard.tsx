import type { Product } from "../types/product-cart";
import { Link } from "react-router-dom";

type ProductCardProps = {
  product: Product;
  //beskriver vad onAdd är, dvs funktion som tar emot product och returnerar void
  onAdd?: (product: Product) => void;
};

function ProductCard({ product, onAdd }: ProductCardProps) {
  const outOfStock = product.stock === 0;

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`}
      className="product-card-link">

      <img src={product.imageUrl} alt={product.name} className="product-image" />

      <div className="product-info">
        <div>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>{product.category}</p>
        </div>

        <strong>{product.price} kr</strong>
      </div>
      </Link>

      {onAdd && (
        <button className="primary-button" onClick={() => onAdd(product)} disabled={outOfStock}>
          {outOfStock ? "Slutsåld" : "Lägg i kundvagn"}
        </button>
      )}
    </article>
  );
}

export default ProductCard;
