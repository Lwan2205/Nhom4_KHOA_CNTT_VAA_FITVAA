import React, { useEffect, useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import Pagination from './Pagination'; // Đảm bảo bạn có component Pagination
import Context from '../context';
import '../assets/css/ProductListByBrand.css';

const ProductListByBrand = () => {
    const { brandId } = useParams(); // Lấy brandId từ URL
    const [products, setProducts] = useState([]); // State để lưu danh sách sản phẩm
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // State cho trang hiện tại
    const [totalPages, setTotalPages] = useState(1); // State cho tổng số trang
    const navigate = useNavigate();
    const productsPerPage = 1; // Số sản phẩm mỗi trang
    const { fetchUserAddToCart } = useContext(Context)

    // Hàm xử lý khi người dùng nhấn vào một sản phẩm
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
                    quantity: 1 // Số lượng mặc định là 1
                }),
                credentials: 'include'
            });
            const data = await response.json();


            if (data.success) {
                toast.success('Sản phẩm đã được thêm vào giỏ hàng');
                fetchUserAddToCart()

            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
            toast.error('Không thể thêm sản phẩm vào giỏ hàng');
        }
    };

    // Gọi API để lấy danh sách sản phẩm theo brandId
    useEffect(() => {
        const fetchProductsByBrand = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8000/api/products/brands/${brandId}?page=${currentPage}&limit=${productsPerPage}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();
                if (data.success) {
                    setProducts(data.data);
                    setTotalPages(data.totalPages); // Cập nhật tổng số trang
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };

        fetchProductsByBrand(); // Gọi hàm khi component được render hoặc khi currentPage thay đổi
    }, [brandId, currentPage]); // Chạy lại khi brandId hoặc currentPage thay đổi

    if (loading) {
        return <p>Đang tải...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (products.length === 0) {
        return <p style={{ textAlign: 'center', marginTop: '20px' }}>Không có sản phẩm nào được tìm thấy.</p>;
    }

    return (
        <div className="product-list-by-brand">
            <h2>Sản phẩm của thương hiệu</h2>
            <div className="product-grid">
                {products.map((product) => (
                    <div key={product._id} className="product-card"
                        onClick={() => handleProductClick(product._id)}
                    >
                        <img
                            src={`${product.images}`}
                            alt={product.name}
                            className="product-image"
                        />
                        <p className="product-name">{product.name}</p>
                        <p className="product-price">{product.price.toLocaleString()} đ</p>
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
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
};

export default ProductListByBrand;
