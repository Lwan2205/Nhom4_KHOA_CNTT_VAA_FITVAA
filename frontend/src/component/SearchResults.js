import React from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import '../assets/css/SearchResults.css'; // Đảm bảo đường dẫn đúng

const SearchResults = () => {
    const location = useLocation();
    const products = location.state?.products || [];
    const navigate = useNavigate(); // Hook điều hướng

    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`); // Điều hướng đến trang chi tiết sản phẩm
    };

    return (
        <div className="product-list-container">
            <h2>Danh sách tìm kiếm</h2>
            <div className="product-grid">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div
                            key={product._id}
                            className="product-card"
                            onClick={() => handleProductClick(product._id)}
                        >
                            <img
                                src={`${product.images}`}
                                alt={product.description}
                                className="product-image"
                            />
                            <p className="product-name">{product.name}</p>
                            <p className="product-price">{product.price.toLocaleString()} đ</p>
                            <button className="buy-button">Chọn mua</button>
                        </div>
                    ))
                ) : (
                    navigate('/') // Hiển thị khi không có sản phẩm
                )}
            </div>
        </div>
    );
};

export default SearchResults;
