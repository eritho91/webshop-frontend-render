import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Product } from "../types/product-cart";
import { getProductById } from "../service/productService";

type ProductDetailPageProps = {
    onAddToCart: (product: Product) => void;
};

function ProductDetailPage({ 
    onAddToCart,
}: ProductDetailPageProps) {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadProduct() {
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
            />
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>I lager: {product.stock}</p>

            <button 
                type="button"
                onClick={() => onAddToCart(product)}
                disabled={product.stock === 0}
            >
                {product.stock === 0 
                ? "Slut i lager" 
                : "Lägg i kundvagn"}
            </button>
        </main>
    );
}

export default ProductDetailPage;
