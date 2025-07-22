import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import styles from "./Checkout.module.css";

const StripePayment = ({ cart, getTotal, formatPrice, clearCart, formData, couponCode, discountValue }) => {

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/create-payment-intent`, {
        amount: Math.round(getTotal() * 100),
      });

      const result = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            address: {
              line1: formData.address,
              postal_code: formData.postalCode,
              city: formData.city
            }
          }
        }
      });

      if (result.error) {
        alert(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          /*qui */
 const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/orders`,
    {
      full_name: `${formData.firstName} ${formData.lastName}`,
      mail: formData.email,
      phone_number: formData.phone,
      billing_address: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
      shipping_address: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
      order_status: 1,
      prints: cart.map(item => ({
        slug: item.slug,
        quantity_req: item.quantity,
      })),
      discount_code: discountValue > 0 ? couponCode.trim() : null,
      payment_intent_id: result.paymentIntent.id,
    }
  );
  console.log("Ordine creato:", response.data);

          alert("✅ Ordine completato!");
          clearCart();
          //qui           // CHIAMA IL BACKEND SOLO SE STRIPE È OK
 
          navigate("/thank-you");
        }
      }
    } catch (err) {
      // console.error(err);
      alert(err);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.paymentForm}>
      <h3 className={styles.sectionTitle}>Pagamento</h3>
      <CardElement className={styles.cardElement} />
      <button type="submit" className={styles.submitButton} disabled={!stripe || loading || !formData.terms}>
        {loading ? "Elaborazione..." : `Conferma Ordine - ${formatPrice(getTotal())}`}
      </button>
    </form>
  );
};

export default StripePayment;


