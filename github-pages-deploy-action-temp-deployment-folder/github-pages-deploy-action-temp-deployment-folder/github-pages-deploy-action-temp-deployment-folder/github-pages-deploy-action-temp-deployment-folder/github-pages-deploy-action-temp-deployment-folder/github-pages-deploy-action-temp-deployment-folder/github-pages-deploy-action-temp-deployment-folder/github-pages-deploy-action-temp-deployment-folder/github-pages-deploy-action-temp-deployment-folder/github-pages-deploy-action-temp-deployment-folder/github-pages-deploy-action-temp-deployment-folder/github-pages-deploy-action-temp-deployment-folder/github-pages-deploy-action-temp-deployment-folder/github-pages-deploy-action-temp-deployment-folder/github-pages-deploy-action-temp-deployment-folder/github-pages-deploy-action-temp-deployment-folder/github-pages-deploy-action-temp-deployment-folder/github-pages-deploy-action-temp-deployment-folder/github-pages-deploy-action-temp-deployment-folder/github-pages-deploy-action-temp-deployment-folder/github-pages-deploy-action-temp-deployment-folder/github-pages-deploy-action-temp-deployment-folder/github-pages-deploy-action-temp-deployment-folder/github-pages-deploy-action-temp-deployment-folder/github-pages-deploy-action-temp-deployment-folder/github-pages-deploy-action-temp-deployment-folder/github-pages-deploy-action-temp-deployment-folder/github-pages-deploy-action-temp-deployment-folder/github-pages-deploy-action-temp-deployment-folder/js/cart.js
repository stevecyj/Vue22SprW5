/* global axios bootstrap */
// eslint-disable-next-line
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';

const site = 'https://vue3-course-api.hexschool.io';
const apiPath = 'steve-vue';

const app = createApp({
  data() {
    return {
      cartData: {},
      products: [],
      productId: '',
      isLoadingItem: '',
    };
  },
  methods: {
    getProducts() {
      const apiUrl = `/v2/api/${apiPath}/products/all`;
      axios
        .get(`${site}${apiUrl}`, {})
        .then((res) => {
          // console.log(res);
          this.products = res.data.products;
        })
        .catch((err) => {
          console.error(err.response);
        });
    },
    openProductModal(id) {
      this.productId = id;
      this.$refs.productModal.openModal();
    },

    // 取得購物車資料
    getCart() {
      const apiUrl = `/v2/api/${apiPath}/cart`;
      axios
        .get(`${site}${apiUrl}`, {})
        .then((res) => {
          console.log('cart', res);
          this.cartData = res.data.data;
        })
        .catch((err) => {
          console.error(err.response);
        });
    },

    // 加入購物車
    addToCart(id, qty = 1) {
      const apiUrl = `/v2/api/${apiPath}/cart`;
      const data = {
        product_id: id,
        qty,
      };
      this.isLoadingItem = id;
      axios
        .post(`${site}${apiUrl}`, {
          data,
        })
        .then((res) => {
          console.log('addToCart', res);
          this.getCart();
          this.isLoadingItem = '';
        })
        .catch((err) => {
          console.error(err.response);
        });
    },

    // 移除購物車
    removeCartItem(id) {
      const apiUrl = `/v2/api/${apiPath}/cart/${id}`;

      this.isLoadingItem = id;
      axios
        .delete(`${site}${apiUrl}`, {})
        .then((res) => {
          // console.log('removeCartItem', res);
          this.getCart();
          this.isLoadingItem = '';
        })
        .catch((err) => {
          console.error(err.response);
        });
    },

    // 更新購物車, PUT
    updateCartItem(item) {
      const apiUrl = `/v2/api/${apiPath}/cart/${item.id}`;
      const data = {
        product_id: item.id,
        qty: item.qty,
      };
      this.isLoadingItem = item.id;
      axios
        .put(`${site}${apiUrl}`, {
          data,
        })
        .then((res) => {
          // console.log('addToCart', res);
          this.getCart();
          this.isLoadingItem = '';
        })
        .catch((err) => {
          console.error(err.response);
        });
    },
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
});

// product modal, $refs
app.component('product-modal', {
  props: ['id'],
  template: '#userProductModal',
  data() {
    return {
      modal: {}, // 讓 methods 可以取用 modal
      product: {},
    };
  },
  watch: {
    // id 改變時，取得該商品資料
    id() {
      this.getProduct();
    },
  },
  methods: {
    // 開啟 modal
    openModal() {
      this.modal.show();
    },

    // 在 product modal 取得遠端資料(code snippet from Hakka copy)
    getProduct() {
      // api for 取得單一品項資料
      const apiUrl = `/v2/api/${apiPath}/product/${this.id}`;
      axios
        .get(`${site}${apiUrl}`, {})
        .then((res) => {
          console.log(res);
          // this.product = res.data.product;
        })
        .catch((err) => {
          console.error(err.response);
        });
    },

    // 清除單筆資料
    clearSingleProduct() {
      this.product = {};
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal, {
      keyboard: false,
    });

    // modal 關閉事件
    // console.log(this.$refs.modal);
    this.$refs.modal.addEventListener('hidden.bs.modal', (event) => {
      this.clearSingleProduct(); // ∵ modal 關閉時資料還在，∴ modal 關閉時清空資料
      console.log('close productModal');
    });

    // test modal is usable or not
    // myModal.show();
  },
});

app.mount('#app');
