import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import { useDispatch } from 'react-redux';
import Context from '../context';
import '../assets/css/ProductDetail.css';

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [relatedProducts, setRelatedProducts] = useState([]);
    const dispatch = useDispatch(); // Dùng để gọi action
    const { fetchUserAddToCart } = useContext(Context)
    const navigate = useNavigate();

    // Fetch the product details
    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const response = await fetch(SummaryApi.product_detail(productId).url, {
                    method: SummaryApi.product_detail(productId).method,
                    credentials: 'include'
                });
                const data = await response.json();
                console.log(data);  // Kiểm tra dữ liệu trả về

                if (data.success) {
                    setProduct(data.data);

                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error('Error fetching product detail:', error);
                toast.error('Failed to fetch product detail');
            }
        };

        fetchProductDetail();
    }, [productId]);

    // Fetch related products based on category
    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/products/related/${productId}`, {
                    method: 'get',
                    credentials: 'include'
                });
                const data = await response.json();

                if (data.success) {
                    setRelatedProducts(data.data);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error('Error fetching related products:', error);
                toast.error('Không thể lấy sản phẩm liên quan');
            }
        };

        if (productId) {
            fetchRelatedProducts();
        }
    }, [productId]);

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    }

    const handleIncreaseQuantity = () => {
        setQuantity(quantity + 1);
    }

    const handleAddToCart = async () => {
        if (!selectedSize) {
            toast.error('Please select a size');
            return;
        }
        try {
            const response = await fetch(SummaryApi.addToCart.url, {
                method: SummaryApi.addToCart.method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productId: product._id,
                    quantity: quantity,
                    size: selectedSize
                }),
                credentials: 'include'
            });
            const data = await response.json();

            if (data.success) {
                toast.success('Sản phẩm đã được thêm vào giỏ hàng');
                fetchUserAddToCart()
                navigate('/cart');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
            toast.error('Không thể thêm sản phẩm vào giỏ hàng');
        }
    };

    if (!product) {
        return <p>Loading...</p>;
    }

    return (
        <div className="product-detail-container">
            <div className="product-detail">
                <div className="product-images">
                    <img
                        src={`${product.images}`}
                        alt={product.name}
                        className="main-image"
                    />
                </div>
                <div className="product-info">
                    <h1>{product.name}</h1>
                    <p className="product-manufacturer">Kiểu dáng: {product.manufacturer?.name}</p>
                    <p className="product-price">
                        {product.price.toLocaleString()} đ
                        {product.discount && (
                            <span className="original-price">
                                {product.origin?.toLocaleString()} đ
                            </span>
                        )}
                    </p>
                    <div className="product-summary">
                        {/* <p><strong>Xuất xứ từ:</strong> {product.manufacturer?.country}</p>
                        <p><strong>Thành phần:</strong> {product.ingredients}</p>
                        <p><strong>Cách dùng:</strong> {product.usage}</p> */}
                        <p><strong>Thông tin sản phẩm :</strong> {product.description}</p>
                    </div>

                    {/* Size Selection */}
                    <div className="size-selection">
                        <label>Chọn Size:</label>
                        <div className="size-options">
                            {product.variants && Array.isArray(product.variants) && product.variants.length > 0 ? (
                                product.variants.map((variant) => (
                                    <button
                                        key={variant._id}  // Dùng _id hoặc bất kỳ giá trị duy nhất nào làm key
                                        className={`size-option ${selectedSize === variant.size ? 'selected' : ''} ${variant.stock === 0 ? 'out-of-stock' : ''}`}
                                        onClick={() => variant.stock > 0 && setSelectedSize(variant.size)}  // Chỉ cho phép chọn nếu có hàng
                                        disabled={variant.stock === 0}  // Vô hiệu hóa nếu hết hàng
                                    >
                                        {variant.stock === 0 ? 'X' : variant.size}  {/* Hiển thị "X" nếu hết hàng */}
                                    </button>
                                ))
                            ) : (
                                <p>Không có size cho sản phẩm này.</p> // Hiển thị thông báo nếu không có variants
                            )}
                        </div>
                    </div>


                    {/* Quantity Selection */}
                    <div className="quantity">
                        <label htmlFor="quantity">Chọn số lượng:</label>
                        <div className='quantity-selection'>
                            <button className='quantity-selection_reduce' onClick={handleDecreaseQuantity}>-</button>
                            <input
                                type="text"
                                id="quantity"
                                name="quantity"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                            />
                            <button className='quantity-selection_increase' onClick={handleIncreaseQuantity}>+</button>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button className="buy-button" onClick={handleAddToCart}>
                        Chọn mua
                    </button>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="related-products">
                    <h3>Sản phẩm liên quan</h3>
                    <div className="related-products-list">
                        {relatedProducts.map((relatedProduct) => (
                            <div key={relatedProduct._id} className="related-product">
                                <img
                                    src={`${relatedProduct.images}`}
                                    alt={relatedProduct.name}
                                    className="related-product-image"
                                />
                                <h4>{relatedProduct.name}</h4>
                                <p className="product-price">
                                    {relatedProduct.price.toLocaleString()} đ
                                    {relatedProduct.discount && (
                                        <span className="original-price">
                                            {relatedProduct.origin?.toLocaleString()} đ
                                        </span>
                                    )}
                                </p>
                                <button className="view-details-button" onClick={() => navigate(`/products/${relatedProduct._id}`)}>
                                    Xem chi tiết
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
