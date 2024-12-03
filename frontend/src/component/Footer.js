import React from 'react';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: '#eaf5f7', padding: '20px', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
            {/* Thông tin liên hệ */}
            <div>
                {/* <h4>Nhà Thuốc Long Quân</h4> */}
                <p>Địa chỉ: Số 1 - Phạm Viết Chánh - Bình Thạnh -  Hồ Chí Minh</p>
                <p>Điện thoại: 0834588827</p>
                <p>Email: <a href="mailto:lonqquan22052004@gmail.com">lonqquan22052004@gmail.com</a></p>
                <p>Website: <a href="https://shopduoc.vn" target="_blank" rel="noopener noreferrer">https://shopthulongquan.vn</a></p>
                <p>&copy; 2020, All rights reserved</p>

                {/* Biểu tượng mạng xã hội */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <img src="path_to_your_assets/facebook_icon.png" alt="Facebook" width="32" />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <img src="path_to_your_assets/twitter_icon.png" alt="Twitter" width="32" />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                        <img src="path_to_your_assets/linkedin_icon.png" alt="LinkedIn" width="32" />
                    </a>
                    <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">
                        <img src="path_to_your_assets/pinterest_icon.png" alt="Pinterest" width="32" />
                    </a>
                </div>
            </div>

            {/* Google Maps */}
            <div style={{ width: '300px', height: '200px' }}>
                <iframe
                    width="300"
                    height="200"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=Số+1+Phan+Văn+Trường,Dịch+Vọng+Hậu,Hà+Nội`}>
                </iframe>
            </div>
        </footer>
    );
};

export default Footer;
