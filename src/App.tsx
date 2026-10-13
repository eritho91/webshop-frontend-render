import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import type { CartItem, Product } from "./types/product-cart";
import { createOrder } from "./service/orderService";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductPage from "./pages/ProductPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WelcomePage from "./pages/WelcomePage";
import AdminProductPage from "./pages/adminProductPage";
import ProtectedRoute, {
  ProtectedAdminRoute,
} from "./components/ProtectedRoute";
import CreateProductPage from "./pages/CreateProductPage";
import PageNotFound from "./pages/PageNotFound";

function App() {
  console.log("App renderas");

  //Läser in kundvagn från sessionStorage när appen startar
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = sessionStorage.getItem("cartItems");

    if (!savedCart) {
      return [];
    }

    try {
      return JSON.parse(savedCart) as CartItem[];
    } catch {
      return [];
    }
  });

  //Spara kundvagn i sessionStorage när den uppdateras
  useEffect(() => {
    sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  //Lägg till produkt eller öka antal om den redan finns
  function addToCart(product: Product) {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...currentItems, { ...product, quantity: 1 }];
    });
  }

  //Öka antal av produkt i kundvagn
  function increaseQuantity(productId: number) {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }

  //Minska antal och ta bort vid noll
  function decreaseQuantity(productId: number) {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  //Skapa order
  async function handleCheckout(): Promise<void> {
    if (cartItems.length === 0) {
      alert("Kundvagnen är tom.");
      return;
    }

    const orderRequest = {
      items: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      await createOrder(orderRequest);

      setCartItems([]);
      sessionStorage.removeItem("cart");

      alert("Ordern har skapats!");
    } catch {
      alert("Något gick fel vid skapandet av ordern.");
    }
  }

  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/welcome" element={<WelcomePage />} />

          <Route
            path="/products"
            element={
              <ProductPage
                cartItems={cartItems}
                onAddToCart={addToCart}
                onIncreaseQuantity={increaseQuantity}
                onDecreaseQuantity={decreaseQuantity}
                onCheckout={handleCheckout}
              />
            }
          />

          <Route
            path="/products/:id"
            element={<ProductDetailPage 
              cartItems={cartItems}
              onAddToCart={addToCart}
              onIncreaseQuantity={increaseQuantity}
              onDecreaseQuantity={decreaseQuantity}
              onCheckout={handleCheckout} 
            />
            }
          />

          <Route element={<ProtectedAdminRoute />}>
            <Route path="/Admin" element={<AdminProductPage />} />
            <Route path="/create-product" element={<CreateProductPage />} />
          </Route>
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
