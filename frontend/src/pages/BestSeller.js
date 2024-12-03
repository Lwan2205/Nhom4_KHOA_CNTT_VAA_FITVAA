import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import '../assets/css/BestSeller.css';
import { useNavigate } from 'react-router-dom';
import Context from '../context';

const BestSeller = () => {
    const [topProducts, setTopProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate()
    const { fetchUserAddToCart } = useContext(Context)

    console.log(
        'topProducts:', topProducts
    )



    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`); // Điều hướng đến trang chi tiết sản phẩm
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
                fetchUserAddToCart()
                toast.success('Sản phẩm đã được thêm vào giỏ hàng');

            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
            toast.error('Không thể thêm sản phẩm vào giỏ hàng');
        }
    };

    useEffect(() => {
        const fetchTopSellingProducts = async () => {
            try {
                const response = await fetch(SummaryApi.get_top_selling_products.url, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                setTopProducts(data);
                console.log('best seller:', data)
            } catch (error) {
                toast.error("Error fetching top selling products.");
            }
        };
        fetchTopSellingProducts();
    }, []);

    return (
        <div className="best-seller-section">
            <h2 className="section-title">Sản phẩm bán chạy</h2>
            <div className="product-grid">
                {topProducts && topProducts.length >= 0 && topProducts.map((product) => (
                    <div className="product-card" key={product._id} onClick={() => handleProductClick(product._id)}>
                        <img src={`${product.images}`} alt={product.name} className="product-image" />
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-price">
                            <span className="current-price">{product.price}đ</span>
                        </p>
                        <button className="buy-button"
                            onClick={(e) => {
                                e.stopPropagation(); // Ngăn chặn sự kiện click trên thẻ cha
                                handleAddToCart(product._id);
                            }}>Chọn mua</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BestSeller;
