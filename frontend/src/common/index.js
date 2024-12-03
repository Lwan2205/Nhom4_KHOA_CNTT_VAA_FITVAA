const backendDomain = "http://localhost:8000";

const SummaryApi = {
    signUP: {
        url: `${backendDomain}/api/auth/register`,
        method: "post"
    },
    signIn: {
        url: `${backendDomain}/api/auth/login`,
        method: "post"
    },

    current_user: {
        url: `${backendDomain}/api/user/profile`,
        method: "get"
    },
    logout_user: {
        url: `${backendDomain}/api/auth/logout`,
        method: 'post'
    },
    category_list: {
        url: `${backendDomain}/api/categories`,
        method: 'get'
    },
    product_list: (categoryId) => ({
        url: `${backendDomain}/api/products/category/${categoryId}`, // Sử dụng `categoryId` động
        method: 'get'
    }),
    product_detail: (productId) => ({
        url: `${backendDomain}/api/products/${productId}`,
        method: 'get'
    }),
    addToCart: {
        url: `${backendDomain}/api/cart/add`,
        method: 'post'
    },
    Cart: {
        url: `${backendDomain}/api/cart`,
        method: 'get'
    },
    cart_delete: (productId, size) => ({
        url: `${backendDomain}/api/cart/remove/${productId}/${size}`,
        method: 'DELETE'
    }),
    cart_update: {
        url: `${backendDomain}/api/cart/update`,
        method: 'put'

    },
    cart_clear: {
        url: `${backendDomain}/api/cart/clear`,
        method: 'delete'

    },
    order_add: {
        url: `${backendDomain}/api/orders/add`,
        method: 'post'
    },
    allUser: {
        url: `${backendDomain}/api/user/admin/users`,
        method: 'get'

    },
    updateUser: {
        url: `${backendDomain}/api/user/profile`,
        method: 'put'
    },
    deleteUser: (userid) => ({
        url: `${backendDomain}/api/user/${userid}`,
        method: 'delete'
    }),
    all_product: {
        url: `${backendDomain}/api/products`,
        method: 'get'
    },
    all_manufacturers: {
        url: `${backendDomain}/api/manufacturers`,
        method: 'get'
    },
    all_discount: {
        url: `${backendDomain}/api/discounts`,
        method: 'get'
    },
    update_product: (productId) => ({
        url: `${backendDomain}/api/products/${productId}`,
        method: `put`
    }),
    delete_product: (productId) => ({
        url: `${backendDomain}/api/products/${productId}`,
        method: `delete`
    }),
    add_product: {
        url: `${backendDomain}/api/products/add`,
        method: 'post'

    },
    all_order: {
        url: `${backendDomain}/api/orders/my-orders`,
        method: 'get'
    },
    get_order_by_id: (id) => ({
        url: `${backendDomain}/api/orders/${id}`,
        method: 'get'

    }),
    update_order_status: (id) => ({
        url: `${backendDomain}/api/orders/${id}`,
        method: 'put'
    }),
    get_top_selling_products: {
        url: `${backendDomain}/api/orders/top-selling`,
        method: 'get'
    },
    get_manufacturers_love: {
        url: `${backendDomain}/api/manufacturers/favourite-brand`,
        method: 'get'
    },
    getAllManufacturers: {
        url: `${backendDomain}/api/manufacturers`,
        method: 'get'
    },
    addManufacturer: {
        url: `${backendDomain}/api/manufacturers/add`,
        method: 'get'
    },
    deleteManufacturer: (id) => ({
        url: `${backendDomain}/api/manufacturers/${id}`,
        method: 'delete'
    }),
    updateManufacturer: (id) => ({
        url: `${backendDomain}/api/manufacturers/${id}`,
        method: 'put'
    }),
    getAllDiscounts: {
        url: `${backendDomain}/api/discounts`,
        method: 'get'
    },
    updateDiscount: (id) => ({
        url: `${backendDomain}/api/discounts/${id}`,
        method: 'put'
    }),
    deleteDiscount: (discountId) => ({
        url: `${backendDomain}/api/discounts/${discountId}`,
        method: 'delete'

    }),
    addDiscount: {
        url: `${backendDomain}/api/discounts/add`,
        method: 'post'
    },
    product_brand: (brandId) => ({
        url: `${backendDomain}/api/products/brands/${brandId}`,
        method: 'get'
    }),
    addToCartProductCount: {
        url: `${backendDomain}/api/cart/count`,
        method: 'get'
    },
    addCategory: {
        url: `${backendDomain}/api/categories/add`,
        method: 'post'
    },
    deleteCategory: (categoryId) => ({
        url: `${backendDomain}/api/categories/${categoryId}`,
        method: 'delete'
    }),
    updateCategory: (categoryid) => ({
        url: `${backendDomain}/api/categories/${categoryid}`,
        method: 'put'
    })




}
export default SummaryApi