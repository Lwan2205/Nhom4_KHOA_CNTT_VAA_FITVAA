import React from 'react';
import Slider from "react-slick";
import '../assets/css/Slider.css';
import image1 from '../assets/images/image.png'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const ImageSlider = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true
    };

    return (
        <>
            <div className="slider-container">
                <Slider {...settings}>
                    <div>
                        <img src='./banner1.png' alt="Slide 1" />
                    </div>
                    <div>
                        <img src="./banner2.png" alt="Slide 2" />
                    </div>
                    <div>
                        <img src="./banner3.png" alt="Slide 3" />
                    </div>
                    <div>
                        <img src="./banner4.png" alt="Slide 4" />
                    </div>
                </Slider>
            </div>


            {/* <div className="action-buttons">
                <div className="action-item">
                    <img src="can-mua-thuoc.png" alt="Cần mua thuốc" />
                    <span>Cần mua thuốc</span>
                </div>
                <div className="action-item">
                    <img src="tu-van-duoc-si.png" alt="Tư vấn với Dược Sỹ" />
                    <span>Tư vấn với Dược Sỹ</span>
                </div>
                <div className="action-item">
                    <img src="tim-nha-thuoc.png" alt="Tìm nhà thuốc" />
                    <span>Tìm nhà thuốc</span>
                </div>
                <div className="action-item">
                    <img src="don-cua-toi.png" alt="Đơn của tôi" />
                    <span>Đơn của tôi</span>
                </div>
                <div className="action-item">   
                    <img src="tiem-vac-xin.png" alt="Tiêm Vắc xin" />
                    <span>Tiêm Vắc xin</span>
                </div>
                <div className="action-item">
                    <img src="kiem-tra-suc-khoe.png" alt="Kiểm tra sức khoẻ" />
                    <span>Kiểm tra sức khoẻ</span>
                </div>
            </div> */}
        </>
    );
}

export default ImageSlider;
