import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useAppContext } from "../context/AppContext";
import CheckoutForm from "./CheckoutForm";
import styles from "./Checkout.module.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Checkout = () => {
  const { cart, clearCart } = useAppContext();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [discountValue, setDiscountValue] = useState(0);
  const [couponError, setCouponError] = useState('');

  const getDiscountedPrice = (item) => {
    return item.discount ? item.price - (item.price * item.discount) / 100 : item.price;
  };

  const getSubtotal = () => cart.reduce((total, item) => total + getDiscountedPrice(item) * item.quantity, 0);

  const getDiscountAmount = () => (getSubtotal() * discountValue) / 100;

  const getShippingCost = () => getSubtotal() - getDiscountAmount() >= 75 ? 0 : 5.99;

  const getTotal = () => getSubtotal() - getDiscountAmount() + getShippingCost();

  const formatPrice = (price) => new Intl.NumberFormat('it-IT', {
    style: 'currency', currency: 'EUR'
  }).format(price);

  if (cart.length === 0) {
    return (
      <div className={styles.emptyCheckout}>
        <div className={styles.container}>
          <h2>Carrello vuoto</h2>
          <button onClick={() => navigate('/gallery')} className={styles.backButton}>
            Torna alla Galleria
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkout}>
      <div className={styles.container}>
        <h1 className={styles.title}>Checkout</h1>
        <div className={styles.checkoutGrid}>
          <Elements stripe={stripePromise}>
            <CheckoutForm
              clearCart={clearCart}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              discountValue={discountValue}
              setDiscountValue={setDiscountValue}
              couponError={couponError}
              setCouponError={setCouponError}
              getSubtotal={getSubtotal}
              getDiscountAmount={getDiscountAmount}
              getShippingCost={getShippingCost}
              getTotal={getTotal}
              formatPrice={formatPrice}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
