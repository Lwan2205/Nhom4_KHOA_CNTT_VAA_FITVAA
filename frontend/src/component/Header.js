import React, { useState, useEffect, useContext } from 'react';
import '../assets/css/Header.css';
import { useSelector, useDispatch } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';
import Context from '../context';
import useWindowWidth from '../hooks/useWindowWidth';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // State để lưu từ khóa tìm kiếm
    const context = useContext(Context)
    const { user } = useSelector((state) => state.user);
    // const totalQuantity = useSelector((state) => state.cart.totalQuantity); // Lấy tổng số lượng từ Redux store

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleMouseEnter = () => {
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        setIsOpen(false);
    };

    const handleLogout = async () => {
        const fetchData = await fetch(SummaryApi.logout_user.url, {
            method: SummaryApi.logout_user.method,
            credentials: 'include'
        });

        const data = await fetchData.json();

        if (data.success) {
            toast.success(data.message);
            dispatch(setUserDetails(null));
            navigate("/");
        }

        if (data.error) {
            toast.error(data.message);
        }
    };

    const width = useWindowWidth();

    const handleCategoryClick = (categoryId) => {
        navigate(`/${categoryId}/products`);
    };

    const handleCart = () => {
        navigate("/cart");
    };

    // Hàm xử lý tìm kiếm category theo tên và điều hướng đến trang kết quả
    const handleCategoryNameSearch = () => {
        if (searchTerm.trim() !== '') {
            fetch(`http://localhost:8000/api/products/category/search?name=${encodeURIComponent(searchTerm)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Điều hướng tới trang kết quả tìm kiếm với dữ liệu sản phẩm
                        navigate(`/search-results`, { state: { products: data.data } });
                    } else {
                        toast.error(data.message);
                    }
                })
                .catch(error => {
                    console.error('Lỗi khi tìm sản phẩm theo tên category:', error);
                    toast.error('Có lỗi xảy ra khi tìm kiếm');
                });
        } else {
            toast.warning('Vui lòng nhập tên category');
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            const fetchData = await fetch(SummaryApi.category_list.url, {
                method: SummaryApi.category_list.method,
                credentials: 'include'
            });
            const data = await fetchData.json();
            if (data.success) {
                setCategories(data.data);
            }
            if (data.error) {
                toast.error(data.message);
            }
        };

        fetchCategories();
    }, []);
    const backgroundImageSource = width > 769 ? 'https://cdn.nhathuoclongchau.com.vn/unsafe/2560x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/theme_11_2024_web_9037cebd39.png' : 'https://cdn.nhathuoclongchau.com.vn/unsafe/2560x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/theme_11_2024_mob_f939b9b947.png'
    return (
        <div className="header">
            <div className='header-background'>
                <img src={backgroundImageSource} />
            </div>
            <div className='header-content' style={{ margin: "0 10%" }}>
                <div className="header-top">
                    <a href="#" className="vaccine-center"> </a>
                    <div className="contact-info">
                        <a href="#" className="download-app">Tải ứng dụng</a>
                        <a href="tel:18006928" className="phone-number">Tư vấn ngay: 1800 6928</a>
                    </div>
                </div>
                <div className="header-bottom">
                    <div className="logo-container">
                        <a href='/'>
                            <img src="https://smakerclothing.com/upload/hinhanh/logo2020-1824.png" alt="/" className="logo" />
                        </a>
                    </div>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Tìm sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="search-button" onClick={handleCategoryNameSearch}>&#128269;</button>
                    </div>

                    {/* Phần thông tin người dùng */}
                    <div className="user-info" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        {
                            user ? (
                                user.isAdmin ? (
                                    <>
                                        <a href="/admin-panel" className="user-name">Trang Admin</a>
                                        <a href="#" onClick={handleLogout} className="logout-link">Đăng xuất</a>
                                    </>
                                ) : (
                                    <>
                                        <a href="#" className="user-name">{user.username}</a>
                                        {isOpen && (
                                            <div className="dropdown-menu">
                                                <a href="/user">Thông tin cá nhân</a>
                                                <a href="/userOder" >Đơn hàng của tôi</a>
                                                <a href="#" onClick={handleLogout}>Đăng xuất</a>
                                            </div>
                                        )}
                                    </>
                                )
                            ) : (
                                <a href="/login" className="user-name">Đăng nhập</a>
                            )
                        }
                        <a href="#" className="cart" onClick={handleCart}>
                            Giỏ hàng
                            {context?.cartProductCount > 0 && (
                                <span className="cart-count">{context?.cartProductCount}</span> // Hiển thị số lượng sản phẩm
                            )}
                        </a>
                    </div>
                </div>
                <div className="menu">
                    <a href="/">Trang chủ</a>
                    <div className="dropdown-menu-container">
                        <a href="#">Danh mục</a>
                        <div className="dropdown-submenu">
                            {categories.map((category) => (
                                <a
                                    key={category._id}
                                    onClick={() => handleCategoryClick(category._id)}
                                    href="#"
                                >
                                    {category.name}
                                </a>
                            ))}
                        </div>
                    </div>
                    <a href="/feedback">FeedBack</a>
                    <a href="discount">Sales</a>
                </div>
            </div>
        </div>
    );
};

export default Header;
