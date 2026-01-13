import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { cartItemsVar, cartVar, userVar } from '../../apollo/store';
import Link from 'next/link';
import Image from 'next/image';
import { DeleteOutline } from '@mui/icons-material';
import Swal from 'sweetalert2';

interface MiniBasketProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const MiniBasket = ({ open, setOpen }: MiniBasketProps) => {
    const cartItems = useReactiveVar(cartItemsVar);
    const cartTotal = useReactiveVar(cartVar);
    const user = useReactiveVar(userVar);
    const router = useRouter();

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    };

    const checkoutHandler = () => {
        setOpen(false);
        if (user?._id) {
            router.push('/shop/checkout');
        } else {
            router.push('/account/login');
        }
    };

    const removeItem = (id: string | number) => {
        const currentItems = cartItemsVar().filter(item => item.id !== id);
        cartItemsVar(currentItems);
        cartVar(currentItems.reduce((acc, item) => acc + item.quantity, 0));
    };

    if (!open) return null;

    return (
        <div className={`mini-basket-menu ${open ? 'open' : ''}`} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <div className="basket-header">
                My Cart ({cartTotal})
            </div>

            <div className="basket-list">
                {cartItems.length === 0 ? (
                    <div className="empty-basket">
                        Your cart is empty
                    </div>
                ) : (
                    cartItems.map((item) => (
                        <div key={item.id} className="basket-item">
                            <div className="img-box">
                                <Image src={item.image} alt={item.name} width={60} height={60} />
                            </div>
                            <div className="info-box">
                                <div className="title">{item.name}</div>
                                <div className="price-box">
                                    {item.quantity} x <span>${item.price.toFixed(2)}</span>
                                </div>
                            </div>
                            <button className="remove-btn" onClick={() => removeItem(item.id)}>
                                <DeleteOutline fontSize="small" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="basket-footer">
                <div className="total-box">
                    <span>Subtotal:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="action-btns">
                    <Link href="/shop/basket">
                        <button className="view-cart" onClick={() => setOpen(false)}>
                            View Cart
                        </button>
                    </Link>
                    <button className="checkout" disabled={cartItems.length === 0} onClick={checkoutHandler}>
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MiniBasket;
