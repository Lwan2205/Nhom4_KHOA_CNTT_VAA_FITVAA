import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../assets/css/Admin.css'

const AdminPanel = () => {
    const { user } = useSelector(state => state?.user)
    const navigate = useNavigate()

    useEffect(() => {
        // if (user?.isAdmin !== false) {
        //     navigate("/")
        // }
    }, [user])

    return (
        <div className='admin-panel'>

            <aside className='admin-aside'>
                <div className='admin-user-info'>
                    <div className='user-avatar'>
                        {
                            user?.profilePic ? (
                                <img src={user?.profilePic} alt={user?.username} />
                            ) : (
                                <FaRegCircleUser />
                            )
                        }
                    </div>
                    <p className='user-name'>{user?.name}</p>
                    {/* <p className='text-sm'>{user?.role}</p> */}
                </div>

                {/***navigation */}
                <div>
                    <nav className='admin-nav'>
                        <div className='admin-nav_li'>
                            <Link to={"all-users"}>Quản lí người dùng</Link>
                        </div>
                        <div className='admin-nav_li'>
                            <Link to={'all-categories'}>Quản lí danh mục</Link>
                        </div>
                        <div className='admin-nav_li'>
                            <Link to={"all-products"}>Quản lí sản phẩm</Link>
                        </div>
                        <div className='admin-nav_li'>
                            <Link to={"all-orders"}>Quản lí đơn hàng</Link>
                        </div>
                        <div className='admin-nav_li'>
                            <Link to={"all-manufactures"}>Quản lí nhãn hiệu</Link>
                        </div>
                        <div className='admin-nav_li'>
                            <Link to={'all-discounts'}>Quản lí giảm giá</Link>
                        </div>

                    </nav>
                </div>
            </aside>

            <main className='admin-main'>
                <Outlet />
            </main>
        </div>
    )
}

export default AdminPanel;
