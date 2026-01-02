import React, { useState } from 'react';
import { NextPage } from 'next';
import { useReactiveVar } from '@apollo/client';
import { cartItemsVar, cartVar } from '../../apollo/store';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import { Lock } from '@mui/icons-material';

const Checkout: NextPage = () => {
    const cartItems = useReactiveVar(cartItemsVar);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zip: '',
        country: 'United States'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    };

    const handlePlaceOrder = () => {
        // Basic validation
        if (!form.firstName || !form.lastName || !form.email || !form.address) {
            Swal.fire('Error', 'Please fill in all required fields.', 'error');
            return;
        }

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);

            // Clear cart
            cartItemsVar([]);
            cartVar(0);

            Swal.fire({
                icon: 'success',
                title: 'Order Placed!',
                text: 'Thank you for your purchase. Your order #12345 has been confirmed.',
                confirmButtonColor: '#181725'
            }).then(() => {
                router.push('/');
            });
        }, 1500);
    };

    if (cartItems.length === 0) {
        return (
            <div className="checkout-page">
                <div className="checkout-container" style={{ justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h2>Your cart is empty</h2>
                        <button
                            className="place-order-btn"
                            style={{ maxWidth: '200px', margin: '20px auto' }}
                            onClick={() => router.push('/shop')}
                        >
                            Return to Shop
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                {/* Shipping Form */}
                <div className="checkout-form-section">
                    <h2>Shipping Details</h2>
                    <div className="form-row">
                        <div className="form-group">
                            <label>First Name*</label>
                            <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="John" />
                        </div>
                        <div className="form-group">
                            <label>Last Name*</label>
                            <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Email Address*</label>
                            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Street Address*</label>
                        <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="123 Main St, Apt 4B" />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>City*</label>
                            <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="New York" />
                        </div>
                        <div className="form-group">
                            <label>Zip / Postal Code*</label>
                            <input type="text" name="zip" value={form.zip} onChange={handleChange} placeholder="10001" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Country*</label>
                        <select name="country" value={form.country} onChange={handleChange}>
                            <option value="United States">United States</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Canada">Canada</option>
                            <option value="Australia">Australia</option>
                        </select>
                    </div>

                    <h2>Payment Method</h2>
                    <div className="payment-methods">
                        <div
                            className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}
                            onClick={() => setPaymentMethod('card')}
                        >
                            <input type="radio" checked={paymentMethod === 'card'} readOnly />
                            <label>Credit Card</label>
                        </div>
                        <div
                            className={`payment-option ${paymentMethod === 'paypal' ? 'selected' : ''}`}
                            onClick={() => setPaymentMethod('paypal')}
                        >
                            <input type="radio" checked={paymentMethod === 'paypal'} readOnly />
                            <label>PayPal</label>
                        </div>
                        <div
                            className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                            onClick={() => setPaymentMethod('cod')}
                        >
                            <input type="radio" checked={paymentMethod === 'cod'} readOnly />
                            <label>Cash on Delivery</label>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="checkout-summary-section">
                    <h2>Order Summary</h2>
                    <div className="summary-items">
                        {cartItems.map(item => (
                            <div key={item.id} className="summary-item">
                                <div className="item-name">
                                    <span>{item.quantity}x</span> {item.name}
                                </div>
                                <div className="item-price">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                    </div>

                    <button
                        className="place-order-btn"
                        onClick={handlePlaceOrder}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Place Order'}
                    </button>

                    <div className="secure-notice">
                        <Lock style={{ fontSize: 14 }} /> Secure Checkout
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withLayoutBasic(Checkout);
