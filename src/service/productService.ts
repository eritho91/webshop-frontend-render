import type { Product } from "../types/product-cart";
import type { CreateProductData } from "../types/product-cart";

const getAuthHeaders = (): HeadersInit => {
  const token = sessionStorage.getItem("accessToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
};

export async function getProducts(): Promise<Product[]> {
  const response = await fetch("http://localhost:9003/gateway/products", {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Error 401: kunde inte verifiera användaren");
    }
    throw new Error(`Kunde inte hämta produkter. Felkod: ${response.status}`);
  }

  const products: Product[] = await response.json();

  return products;
}

export async function getProductById(id: number): Promise<Product> {
  const response = await fetch(`http://localhost:9003/gateway/products/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Error 401: kunde inte verifiera användaren");
    }

    if (response.status === 404) {
      throw new Error("Error 404: Produkten hittades inte");
    }

    throw new Error(`Kunde inte hämta produkt. Felkod: ${response.status}`);
  }

  const product: Product = await response.json();

  return product;
}

export async function createProduct(
  productData: CreateProductData,
): Promise<Product> {
  const response = await fetch("http://localhost:9003/gateway/products", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Error 401: kunde inte verifiera användaren");
    }
    if (response.status === 403) {
      throw new Error(
        "Error 403: Du saknar ADMIN-behörighet för att skapa produkter",
      );
    }
    throw new Error(`Kunde inte skapa produkt. Felkod: ${response.status}`);
  }

  const newProduct: Product = await response.json();

  return newProduct;
}
