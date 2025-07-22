import { useState } from "react";
import StripePayment from "./StripePayment";
import styles from "./Checkout.module.css";
import { useAppContext } from "../context/AppContext";
import axios from "axios";

const CheckoutForm = ({
    clearCart,
    couponCode, setCouponCode,
    discountValue, setDiscountValue,
    couponError, setCouponError,
    getSubtotal, getDiscountAmount, getShippingCost, getTotal, formatPrice
}) => {
    const { cart } = useAppContext();
    console.log(cart);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        terms: false
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const applyCoupon = async () => {
        setCouponError('');
        setDiscountValue(0);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/discounts/${couponCode.trim()}`);
            if (res.data?.discount_value) {
                setDiscountValue(res.data.discount_value);
            } else {
                setCouponError('Codice non valido.');
            }
        } catch (error) {
            setCouponError(error.response?.data?.message || 'Errore durante la verifica del codice.');
            setDiscountValue(0);
        }
    };

    return (
        <>
            <div className={styles.checkoutForm}>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Informazioni di contatto</h2>
                    <div className={styles.formGrid}>
                        <div className={styles.inputGroup}>
                            <input
                                name="firstName"
                                placeholder="Nome"
                                value={formData.firstName}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <input
                                name="lastName"
                                placeholder="Cognome"
                                value={formData.lastName}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Telefono"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                            <input
                                name="address"
                                placeholder="Indirizzo"
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <input
                                name="city"
                                placeholder="Città"
                                value={formData.city}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <input
                                name="postalCode"
                                placeholder="CAP"
                                value={formData.postalCode}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>

                <label className={styles.checkbox}>
                    <input type="checkbox" name="terms" checked={formData.terms} onChange={handleInputChange} />
                    Accetto i termini e condizioni
                </label>

                <StripePayment
                    cart={cart}
                    getTotal={getTotal}
                    formatPrice={formatPrice}
                    clearCart={clearCart}
                    formData={formData}

                    discountValue={discountValue}
                    couponCode={couponCode}

                />
            </div>

            <div className={styles.orderSummary}>
                <div className={styles.summaryCard}>
                    <h3 className={styles.summaryTitle}>Riepilogo Ordine</h3>

                    <div className={styles.orderItems}>


                        {cart.map((item, index) => (
                            <div key={index} className={styles.orderItem}>
                                <div className={styles.itemImage}>
                                    <img src={item.img_url} alt={item.name} />
                                </div>
                                <div className={styles.itemDetails}>
                                    <span className={styles.itemName}>{item.name}</span>
                                    <span className={styles.itemQuantity}>Qty: {item.quantity}</span>
                                </div>
                                <span className={styles.itemPrice}>
                                    {formatPrice(item.price * item.quantity)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.couponSection}>
                        <div className={styles.couponInput}>
                            <input
                                type="text"
                                placeholder="Codice sconto"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                disabled={discountValue > 0}
                            />
                            <button
                                type="button"
                                onClick={applyCoupon}
                                disabled={discountValue > 0 || !couponCode.trim()}
                            >
                                Applica
                            </button>
                        </div>

                        {couponError && (
                            <div className={styles.error}>{couponError}</div>
                        )}

                        {discountValue > 0 && (
                            <div className={styles.appliedCoupon}>
                                <span>Sconto {discountValue}% applicato</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDiscountValue(0);
                                        setCouponCode("");
                                        setCouponError("");
                                    }}
                                >
                                    Rimuovi
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={styles.summaryRows}>
                        <div className={styles.summaryRow}>
                            <span>Subtotale</span>
                            <span>{formatPrice(getSubtotal())}</span>
                        </div>

                        {discountValue > 0 && (
                            <div className={styles.summaryRow}>
                                <span>Sconto</span>
                                <span className={styles.discount}>-{formatPrice(getDiscountAmount())}</span>
                            </div>
                        )}

                        <div className={styles.summaryRow}>
                            <span>Spedizione</span>
                            <span className={styles.freeShipping}>
                                {getShippingCost() === 0 ? "Gratuita" : formatPrice(getShippingCost())}
                            </span>
                        </div>

                        <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                            <span>Totale</span>
                            <span>{formatPrice(getTotal())}</span>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default CheckoutForm;
