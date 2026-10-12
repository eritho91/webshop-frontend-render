import { useEffect, useState } from "react";
import type { Product } from "../types/product-cart";
import { getProducts } from "../service/productService";
import ProductCard from "../components/ProductCard";
import { categories } from "../types/category";

//beskriver värden/funktioner som förväntas från App
type ProductPageProps = {
  onAddToCart: (product: Product) => void;
};

//komponenten tar emot props
function ProductPage({ onAddToCart }: ProductPageProps) {
  console.log("ProductPage körs");

  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  //innehåller vagnens produkter + för att ändra. innehåller en lista av items

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

  function renderFilteredProducts() {
    if (error) {
      return null;
    }
    if (filteredProducts.length === 0) {
      return <p>Inga produkter matchade din sökning</p>;
    }
    return (
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={onAddToCart} />
        ))}
      </div>
    );
  }

  //!showCart byter till det motsatta, så om cart är false så ska den bli true on click
  //showCart ? = om cart visas skrivs dölj annars visa kundvagn
  //showCart && = Om showcart är true rendera cart och produkterna från cart
  return (
    <main className="product-page">
      <div className="product-page-header">
        <div>
          <h1>Produkter</h1>
        </div>
      </div>

      <input
        id="product-search"
        type="search"
        placeholder="Sök produkter.."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
      <select
        id="product-category"
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

      {renderFilteredProducts()}
    </main>
  );
}

export default ProductPage;
