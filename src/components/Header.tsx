import { useNavigate, Link } from "react-router-dom";
import {
  logout,
  isAuthenticated,
  getCurrentUser,
} from "../service/authService";
import type { CartItem } from "../types/product-cart";
import CartDropdown from "./CartDropdown";
import { useState } from "react";

type HeaderProps = {
  cartItems: CartItem[];
  onIncrease: (productId: number) => void;
  onDecrease: (productId: number) => void;
  onCheckout: () => void;
};

function Header({
  cartItems,
  onIncrease,
  onDecrease,
  onCheckout,
}: HeaderProps) {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const authenticated = isAuthenticated();
  const isAdmin = currentUser?.roles.includes("ROLE_ADMIN") ?? false;

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const [mobileMenu, setMobileMenu] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function logoutHandler() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logout();
      setMobileMenu(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Utloggningen misslyckades:", error);
      window.alert("Kunde inte logga ut.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="header">
      <div className="logo">E.J.E.A</div>

      <nav className="nav">
        <Link to="/products">Produkter</Link>
      </nav>

      <div className="header-actions">
        {authenticated && (
          <div className="user-menu">
            <span className="user-name">
              {currentUser?.username}
            </span>

            <div className="user-dropdown-menu">
              <button
                type="button"
                onClick={logoutHandler}
                disabled={loggingOut}
              >
                Logga ut
              </button>

              {isAdmin && <Link to="/admin">Admin</Link>}
            </div>
          </div>
        )}

        <div className="cart-window">
          <button type="button" className="cart-button">
            Kundvagn [{cartCount}]
          </button>

          <CartDropdown
            cartItems={cartItems}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
            onCheckout={onCheckout}
          />
        </div>
      </div>

      <button
        type="button"
        className="mobile-menu-button"
        aria-label={mobileMenu ? "Stäng meny" : "Öppna meny"}
        aria-expanded={mobileMenu}
        aria-controls="mobile-nav"
        onClick={() => setMobileMenu(!mobileMenu)}
      >
        {mobileMenu ? "X" : "☰"}
      </button>

      {mobileMenu && (
        <nav id="mobile-nav" className="mobile-nav">
          {authenticated && (
            <>
              <span className="mobile-user-name">
                {currentUser?.username}
              </span>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenu(false)}
                >
                  Admin
                </Link>
              )}

              <button
                type="button"
                onClick={logoutHandler}
                disabled={loggingOut}
              >
                Logga ut
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
}

export default Header;