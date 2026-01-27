import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { cartItemsVar, cartVar } from '../../apollo/store';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { DeleteOutline, Add, Remove } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import Swal from 'sweetalert2';

const Basket: NextPage = () => {
    const router = useRouter();
    const cartItems = useReactiveVar(cartItemsVar);
    const device = useDeviceDetect();

    const updateQuantity = (id: string | number, change: number) => {
        const currentItems = [...cartItemsVar()];
        const index = currentItems.findIndex(item => item.id === id);

        if (index > -1) {
            const newQuantity = currentItems[index].quantity + change;
            if (newQuantity > 0) {
                currentItems[index] = { ...currentItems[index], quantity: newQuantity };
                cartItemsVar(currentItems);
                updateTotalCount(currentItems);
            }
        }
    };

    const removeItem = (id: string | number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to remove this item?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
            if (result.isConfirmed) {
                const currentItems = cartItemsVar().filter(item => item.id !== id);
                cartItemsVar(currentItems);
                updateTotalCount(currentItems);
                Swal.fire(
                    'Removed!',
                    'Item has been removed.',
                    'success'
                )
            }
        })
    };

    const updateTotalCount = (items: any[]) => {
        const total = items.reduce((acc, item) => acc + item.quantity, 0);
        cartVar(total);
    };

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    };

    if (device === 'mobile') {
        return (
            <div className="basket-page">
                <div className="basket-items">
                    <h2>Shopping Cart ({cartItems.length})</h2>
                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <p>Your cart is empty.</p>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="item-image">
                                    <Image
                                        src={item.image.startsWith('http')
                                            ? item.image
                                            : `${process.env.REACT_APP_API_URL}/${item.image}`
                                        }
                                        alt={item.name}
                                        width={80}
                                        height={80}
                                    />
                                </div>
                                <div className="item-info">
                                    <h3>{item.name}</h3>
                                    <p className="item-price">${item.price.toFixed(2)}</p>
                                    <div className="item-controls">
                                        <div className="item-quantity">
                                            <button onClick={() => updateQuantity(item.id, -1)}><Remove fontSize="small" /></button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)}><Add fontSize="small" /></button>
                                        </div>
                                    </div>
                                </div>
                                <div className="item-remove">
                                    <button onClick={() => removeItem(item.id)}>
                                        <DeleteOutline color="action" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="basket-summary-fixed">
                    <div className="total-info">
                        <div className="label">Total</div>
                        <div className="value">${calculateTotal().toFixed(2)}</div>
                    </div>
                    <button
                        className="checkout-btn"
                        disabled={cartItems.length === 0}
                        onClick={() => router.push('/shop/checkout')}
                    >
                        Checkout
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="basket-page">
            <div className="basket-container">
                <div className="basket-items">
                    <h2>Shopping Cart ({cartItems.length} items)</h2>

                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <p>Your cart is empty.</p>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="item-image">
                                    <Image
                                        src={item.image.startsWith('http')
                                            ? item.image
                                            : `${process.env.REACT_APP_API_URL}/${item.image}`
                                        }
                                        alt={item.name}
                                        width={100}
                                        height={100}
                                    />
                                </div>
                                <div className="item-info">
                                    <h3>{item.name}</h3>
                                    <p className="item-price">${item.price.toFixed(2)}</p>
                                    {item.sku && <p className="item-sku">SKU: {item.sku}</p>}
                                </div>
                                <div className="item-quantity">
                                    <button onClick={() => updateQuantity(item.id, -1)}><Remove fontSize="small" /></button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)}><Add fontSize="small" /></button>
                                </div>
                                <div className="item-remove">
                                    <button onClick={() => removeItem(item.id)}>
                                        <DeleteOutline />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="basket-summary">
                    <h2>Order Summary</h2>
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
                    <Link href="/shop/checkout">
                        <button className="checkout-btn" disabled={cartItems.length === 0}>
                            Checkout
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default withLayoutBasic(Basket);
