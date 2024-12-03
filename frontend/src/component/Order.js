import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/Order.css';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import { Box, Button, Divider, FormControl, InputLabel } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import MuiCheckBox from '@mui/material/Checkbox';
import Card from './atom/Card';
import TextField from '@mui/material/TextField';
import { FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';

const Order = () => {
    const location = useLocation(); // Lấy dữ liệu từ trang Cart
    const navigate = useNavigate();
    const { cartItems, totalPrice, discount, finalAmount } = location.state || {};

    useEffect(() => {
        if (!cartItems || cartItems.length === 0) {
            toast.error('Không có sản phẩm trong giỏ hàng, vui lòng kiểm tra lại!');
            navigate('/cart'); // Điều hướng về trang Cart
        }
    }, [cartItems, navigate]);

    const [address, setAddress] = useState("");
    const [selectedPayment, setSelectedPayment] = useState("COD");

    const handleCompleteOrder = async () => {
        if (!address) {
            toast.error("Vui lòng nhập địa chỉ giao hàng!");
            return;
        }

        try {
            const orderData = {
                address,
                paymentMethod: selectedPayment,
            };

            // Gửi yêu cầu POST tới backend để tạo đơn hàng
            const response = await fetch(SummaryApi.order_add.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                const result = await response.json();
                if (selectedPayment === 'VNPay' && result.payUrl) {
                    window.location.href = result.payUrl;
                } else if (result.success) {
                    toast.success('Mua hàng thành công!');
                    navigate('/');
                } else {
                    toast.error(result.message || 'Không thể hoàn tất đơn hàng');
                }
            } else {
                toast.error('Đã xảy ra lỗi khi gửi yêu cầu');
            }
        } catch (error) {
            console.error('Error completing order:', error);
            toast.error('Đã xảy ra lỗi khi hoàn tất đơn hàng');
        }
    };

    return (
        // <div className="order-container">
        //     <h2>Đơn Hàng Của Bạn</h2>
        //     <div className="product-list">
        //         {cartItems && cartItems.map((item) => (
        //             <div key={item._id} className="product-item">
        //                 <img src={`http://localhost:8000${item.productId?.images}`} alt={item.productId?.name || 'Product'} className="product-image" />
        //                 <div className="product-details">
        //                     <h3>{item.productId?.name || 'Tên sản phẩm'}</h3>
        //                     <p>Giá: {(item.productId?.price || 0).toLocaleString()} đ</p>
        //                     <p>Số lượng: {item.quantity}</p>
        //                 </div>
        //             </div>
        //         ))}
        //     </div>

        //     <div className="shipping-info">
        //         <h3>Địa chỉ giao hàng</h3>
        //         <input
        //             type="text"
        //             placeholder="Nhập địa chỉ giao hàng"
        //             value={address}
        //             onChange={(e) => setAddress(e.target.value)}
        //             className="address-input"
        //         />
        //     </div>

        //     <div className="payment-options">
        //         <h3>Chọn phương thức thanh toán</h3>
        //         <div className="payment-option">
        //             <input
        //                 type="radio"
        //                 id="cod"
        //                 name="payment-method"
        //                 value="COD"
        //                 checked={selectedPayment === "COD"}
        //                 onChange={() => setSelectedPayment("COD")}
        //             />
        //             <label htmlFor="cod">Thanh toán tiền mặt khi nhận hàng (COD)</label>
        //         </div>
        //         <div className="payment-option">
        //             <input
        //                 type="radio"
        //                 id="vnpay"
        //                 name="payment-method"
        //                 value="VNPay"
        //                 checked={selectedPayment === "VNPay"}
        //                 onChange={() => setSelectedPayment("VNPay")}
        //             />
        //             <label htmlFor="vnpay">Thanh toán bằng VNPay</label>
        //         </div>
        //     </div>

        //     <div className="order-summary">
        //         <h3>Tóm tắt đơn hàng</h3>
        //         <p>Tổng tiền: {totalPrice?.toLocaleString()} đ</p>
        //         <p>Giảm giá: -{discount?.toLocaleString()} đ</p>
        //         <h3>Thành tiền: {finalAmount?.toLocaleString()} đ</h3>
        //         <button className="complete-button" onClick={handleCompleteOrder}>Hoàn tất đơn hàng</button>
        //     </div>
        // </div>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginTop: '50px' }}>
            <Box sx={{ display: 'flex', marginLeft: '20px', gap: '30px', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                <Box sx={{ width: '100%', marginBottom: '50px' }}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: '700' }} align='left'>Sản phẩm</TableCell>
                                    <TableCell sx={{ fontWeight: '700' }} align="center">Giá</TableCell>
                                    <TableCell sx={{ fontWeight: '700' }} align="center">Số lượng</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    cartItems.map((item) => (
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
                                            </TableCell>
                                            <TableCell align="center">{item.quantity}</TableCell>
                                            <TableCell align="center">{item.productId?.price}</TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Box sx={{ width: '100%', marginBottom: '50px' }}>
                    <h3>Địa chỉ giao hàng</h3>
                    <Card sx={{ width: 'calc(100% - 60px)', maxWidth: '100% !important' }}>
                        <FormControl>
                            <InputLabel
                                htmlFor="address"
                            > </InputLabel>
                            <TextField
                                id="address"
                                label="Nhập địa chỉ giao hàng"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            ></TextField>
                        </FormControl>
                    </Card>
                    <Card sx={{ width: 'calc(100% - 60px)', maxWidth: '100% !important' }}>
                        <h3>Phương thức thanh toán</h3>
                        <FormControl>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                            >
                                <FormControlLabel value="VNPay" control={<Radio />} label="VNPay" id="vnpay" checked={selectedPayment === "VNPay"}
                                    onChange={() => setSelectedPayment("VNPay")} />
                                <FormControlLabel value="COD" control={<Radio />} label="COD" type="radio"
                                    id="cod"
                                    name="payment-method"
                                    checked={selectedPayment === "COD"}
                                    onChange={() => setSelectedPayment("COD")} />
                                <FormControlLabel value="other" control={<Radio />} label="Other" />
                            </RadioGroup>
                        </FormControl>
                    </Card>
                </Box>
            </Box>
            <Card sx={{ width: '40%', alignSelf: 'flex-start', marginTop: '0 !important', position: 'sticky' }} >
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
                        <Button onClick={handleCompleteOrder} sx={{
                            backgroundColor: '#007bff',
                            color: '#fff',
                            padding: '10px 20px',
                            width: '100%',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '700'
                        }}>
                            Mua Hàng
                        </Button>
                    </Box>
                </div>

            </Card>
        </Box >

    );
};

export default Order;
