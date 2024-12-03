import React, { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import { useNavigate } from 'react-router-dom';
import Context from '../context';
import '../assets/css/Cart.css';
import { Box, Button, Divider } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import MuiCheckBox from '@mui/material/Checkbox';
import Card from './atom/Card';
import { FaTrashAlt } from 'react-icons/fa';



const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const navigate = useNavigate();
    const { fetchUserAddToCart } = useContext(Context)




    useEffect(() => {

        const fetchCartItems = async () => {
            try {
                const response = await fetch(SummaryApi.Cart.url, {
                    method: SummaryApi.Cart.method,
                    credentials: 'include'
                });
                const data = await response.json();

                if (data.success) {
                    setCartItems(data.data.products);
                    calculateTotal(data.data.products)


                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error('Error fetching cart items:', error);
                toast.error('Failed to fetch cart items');
            }
        };

        fetchCartItems();
    }, []);

    const calculateTotal = (items) => {
        let total = 0;
        let discountAmount = 0;
        items.forEach(item => {
            const itemTotal = item.productId?.price * item.quantity || 0;
            total += itemTotal;

            if (item.productId.discount) {
                discountAmount += (item.productId.discount.discountPercent / 100) * itemTotal;

            }
        });
        setTotalPrice(total);
        setDiscount(discountAmount);
    };

    const handleSelectItem = (itemId) => {
        const updatedItems = cartItems.map(item => {
            if (item._id === itemId) {
                return { ...item, selected: !item.selected };
            }
            return item;
        });
        setCartItems(updatedItems);
    };

    const handleQuantityChange = (itemId, productId, size, newQuantity) => {
        if (newQuantity < 1) return;

        const updatedItems = cartItems.map(item => {
            if (item._id === itemId) {
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
        updateCartItemQuantity(productId, size, newQuantity); // Thêm size vào đây
    };

    const handleRemoveItem = (productId, size) => {
        const updatedItems = cartItems.filter(item => item.productId._id !== productId || item.size !== size);
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
        removeItemFromCart(productId, size); // Chuyển thêm size
    };

    const handleClearCart = async () => {
        try {
            const response = await fetch(SummaryApi.cart_clear.url, {
                method: 'DELETE',
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                fetchUserAddToCart()
                setCartItems([]);
                calculateTotal([]);
                toast.success('Đã xóa toàn bộ sản phẩm trong giỏ hàng!');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
            toast.error('Failed to clear cart');
        }
    };

    const handleCheckout = () => {
        navigate('/order', {
            state: {
                cartItems: cartItems,
                totalPrice: totalPrice,
                discount: discount,
                finalAmount: totalPrice - discount
            }
        });
    };

    const updateCartItemQuantity = async (productId, size, quantity) => {
        try {
            const response = await fetch(SummaryApi.cart_update.url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId, size, quantity }), // Thêm size vào body
                credentials: 'include',
            });
            const data = await response.json();
            if (!data.success) {
                fetchUserAddToCart();
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error updating cart item quantity:', error);
            toast.error('Failed to update cart item quantity');
        }
    };

    const removeItemFromCart = async (productId, size) => {
        try {
            const response = await fetch(SummaryApi.cart_delete(productId, size).url, {
                method: 'DELETE',
                credentials: 'include'
            });
            const data = await response.json();
            if (!data.success) {
                fetchUserAddToCart();
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error removing cart item:', error);
            toast.error('Failed to remove item from cart');
        }
    };



    return (
        // <div className="cart-container">
        //     <h2>Giỏ hàng của bạn</h2>
        //     <div className="cart-items">
        //         {cartItems.map((item) => (
        //             <div key={item._id} className="cart-item">
        //                 <input
        //                     type="checkbox"
        //                     checked={item.selected}
        //                     onChange={() => handleSelectItem(item._id)}
        //                 />

        //                 <img
        //                     src={`http://localhost:8000${item.productId?.images}`}


        //                     alt={item.productId?.name || 'Product'}
        //                     className="cart-item-image"
        //                 />
        //                 <div className="cart-item-info">
        //                     <h3>{item.productId?.name || 'Tên sản phẩm'}</h3>
        //                     <p>{(item.productId?.price || 0).toLocaleString()} đ</p>
        //                     <div className="quantity-control">
        //                         <button
        //                             onClick={() => handleQuantityChange(item._id, item.productId._id, item.quantity - 1)}
        //                             disabled={item.quantity <= 1}
        //                         >-</button>
        //                         <input
        //                             type="number"
        //                             value={item.quantity}
        //                             min="1"
        //                             onChange={(e) => handleQuantityChange(item._id, item.productId._id, Number(e.target.value))}
        //                         />
        //                         <button
        //                             onClick={() => handleQuantityChange(item._id, item.productId._id, item.quantity + 1)}
        //                         >+</button>
        //                     </div>
        //                     <button className="remove-button" onClick={() => handleRemoveItem(item.productId._id)}>
        //                         Xóa
        //                     </button>
        //                 </div>
        //             </div>
        //         ))}
        //     </div>
        //     <div className="cart-summary">
        //         <h3>Tóm tắt đơn hàng</h3>
        //         <p>Tổng tiền: {totalPrice.toLocaleString()} đ</p>
        //         <p>Giảm giá: -{discount.toLocaleString()} đ</p>
        //         <p>Thành tiền: {(totalPrice - discount).toLocaleString()} đ</p>
        //         <button className="checkout-button" onClick={handleCheckout}>
        //             Mua hàng
        //         </button>
        //         <button className="clear-cart-button" onClick={handleClearCart}>
        //             Xóa tất cả
        //         </button>
        //     </div>
        // </div>
        <Box sx={{ margin: '50px auto' }}>
            <h2>Giỏ hàng của bạn</h2>
            <Box sx={{ display: 'flex', gap: '30px', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{ width: '50%' }}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: '700' }} align='left'>Sản phẩm</TableCell>
                                    <TableCell sx={{ fontWeight: '700' }} align="center">Giá</TableCell>
                                    <TableCell sx={{ fontWeight: '700' }} align="center">Số lượng</TableCell>
                                    <TableCell sx={{ fontWeight: '700' }} align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cartItems.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell component="th" scope="row" sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <Box sx={{ border: '1px solid #ccc', borderRadius: '12px', padding: '5px 10px' }}>
                                                <img
                                                    src={`${item.productId?.images}`}
                                                    alt={item.productId?.name || 'Product'}
                                                    className="cart-item-image"
                                                />
                                            </Box>
                                            <p>{item.productId?.name || 'Tên sản phẩm'}</p>
                                            <p>Size: {item.size || 'Mặc định'}</p>
                                        </TableCell>
                                        <TableCell align="center">{item.productId?.price}</TableCell>
                                        <TableCell align="center">
                                            <div className="quantity-control">
                                                <button
                                                    onClick={() => handleQuantityChange(item._id, item.productId._id, item.size, item.quantity - 1)} // Thêm size vào đây
                                                    disabled={item.quantity <= 1}
                                                >-</button>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    min="1"
                                                    onChange={(e) => handleQuantityChange(item._id, item.productId._id, item.size, Number(e.target.value))} // Thêm size vào đây
                                                />
                                                <button
                                                    onClick={() => handleQuantityChange(item._id, item.productId._id, item.size, item.quantity + 1)} // Thêm size vào đây
                                                >+</button>
                                            </div>
                                        </TableCell>
                                        <TableCell align="right">
                                            <div className='remove-button' onClick={() => handleRemoveItem(item.productId._id, item.size)}>
                                                <FaTrashAlt />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>

                        </Table>
                        <Box sx={{ margin: '20px 0', width: '100%', display: 'flex', justifyContent: 'center' }}>
                            {
                                cartItems.length === 0 ? <h4>Không có sản phẩm nào trong giỏ hàng</h4> : <Button sx={{ margin: 'auto', width: '80%' }} className="clear-cart-button" onClick={handleClearCart}>
                                    Xóa tất cả
                                </Button>
                            }

                        </Box>
                    </TableContainer>
                </Box>
                <Card sx={{ width: '40%' }}>
                    <div className="cart-summary">
                        <h3>Tóm tắt đơn hàng</h3>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', height: '40px' }} >
                            <p>Tổng tiền: </p>
                            <h4>{totalPrice.toLocaleString()} đ</h4>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>Giảm giá: </p>
                            <h4 style={{ color: '#f79009' }}>-{discount.toLocaleString()} đ</h4>

                        </Box>
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h3>Thành tiền </h3>
                            <h3 style={{ color: '#1250dc' }}>{(totalPrice - discount).toLocaleString()} đ</h3>
                        </Box>

                        <Box sx={{ margin: '20px auto', width: '80%' }}>
                            <Button sx={{
                                backgroundColor: '#007bff',
                                color: '#fff',
                                padding: '10px 20px',
                                width: '100%',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: '700'
                            }} onClick={handleCheckout}>
                                Mua Hàng
                            </Button>
                        </Box>
                    </div>
                </Card>
            </Box>
        </Box >
    );
};

export default Cart;
