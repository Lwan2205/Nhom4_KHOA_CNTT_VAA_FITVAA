import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import '../assets/css/BestSeller.css'; // Thay đổi CSS nếu cần
import { useNavigate } from 'react-router-dom';
import Context from '../context';

const DiscountedProducts = () => {
    const [discountedProducts, setDiscountedProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();
    const { fetchUserAddToCart } = useContext(Context);

    console.log('discountedProducts:', discountedProducts);

    // Hàm điều hướng đến chi tiết sản phẩm
    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`);
    };

    // Hàm thêm sản phẩm vào giỏ hàng
    const handleAddToCart = async (productId) => {
        try {
            const response = await fetch(SummaryApi.addToCart.url, {
                method: SummaryApi.addToCart.method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productId: productId,
                    quantity: quantity
                }),
                credentials: 'include'
            });
            const data = await response.json();

            if (data.success) {
                fetchUserAddToCart();
                toast.success('Sản phẩm đã được thêm vào giỏ hàng');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
            toast.error('Không thể thêm sản phẩm vào giỏ hàng');
        }
    };

    // Lấy danh sách sản phẩm giảm giá từ API
    useEffect(() => {
        const fetchDiscountedProducts = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/products/discount', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();

                // Tính discountedPrice
                const updatedProducts = data.products.map((product) => {
                    if (product.discount && product.discount.discountPercent) {
                        const discountedPrice =
                            product.price - (product.price * product.discount.discountPercent) / 100;
                        return { ...product, discountedPrice }; // Gán thêm discountedPrice vào product
                    }
                    return product; // Giữ nguyên nếu không có discount
                });

                setDiscountedProducts(updatedProducts);
                console.log('discounted products:', updatedProducts);
            } catch (error) {
                console.error('Error fetching discounted products:', error);
                toast.error('Không thể lấy danh sách sản phẩm giảm giá.');
            }
        };
        fetchDiscountedProducts();
    }, []);

    return (
        <div className="discounted-products-section">
            <h2 className="section-title">Sản phẩm giảm giá</h2>
            <div className="product-grid">
                {discountedProducts && discountedProducts.length > 0 ? (
                    discountedProducts.map((product) => (
                        <div
                            className="product-card"
                            key={product._id}
                            onClick={() => handleProductClick(product._id)}
                        >
                            <img
                                src={`${product.images}`}
                                alt={product.name}
                                className="product-image"
                            />
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-price">
                                <span className="current-price">{product.discountedPrice?.toFixed(0)}đ</span>{' '}
                                <span className="original-price">{product.price}đ</span>
                            </p>
                            <p className="product-discount">
                                Giảm {product.discount.discountPercent}%!
                            </p>
                            <button
                                className="buy-button"
                                onClick={(e) => {
                                    e.stopPropagation(); // Ngăn chặn sự kiện click trên thẻ cha
                                    handleAddToCart(product._id);
                                }}
                            >
                                Chọn mua
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Không có sản phẩm giảm giá.</p>
                )}
            </div>
        </div>
    );
};

export default DiscountedProducts;
