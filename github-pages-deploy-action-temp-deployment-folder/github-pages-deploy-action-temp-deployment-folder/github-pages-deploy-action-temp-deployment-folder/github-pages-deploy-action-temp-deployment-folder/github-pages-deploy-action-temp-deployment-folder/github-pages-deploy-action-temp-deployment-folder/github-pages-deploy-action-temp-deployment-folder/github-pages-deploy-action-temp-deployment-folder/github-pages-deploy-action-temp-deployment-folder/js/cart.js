/* global axios bootstrap VeeValidate VeeValidateRules VeeValidateI18n Vue VueLoading Swal */
// eslint-disable-next-line
// import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';
// 之前使用不同的 vue instance

const site = 'https://vue3-course-api.hexschool.io';
const apiPath = 'steve-vue';

// vee-validate 載入規則
// VeeValidate.defineRule('email', VeeValidateRules.email);
// VeeValidate.defineRule('required', VeeValidateRules.required);

// 加入所有規則(CDN版本)
Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

// vee-validate 多國語系
VeeValidateI18n.loadLocaleFromURL('./js/zh_TW.json');

// vee-validate Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});

const app = Vue.createApp({
  data() {
    return {
      cartData: {}, // cart 是拿整包資料
      products: [],
      productId: '',
      productQty: 'aaaa',
      isLoadingItem: '',
      isLoading: false,
      fullPage: true,
    };
  },
  computed: {
    // classObject() {
    //   return {
    //     disabled: this.cartData.carts?.length === 0 || Object.keys(errors).length !== 0, // 逆天可選鍊運算子
    //   };
    // },

    // check more
    singleItem() {
      const prodAry = this.cartData.carts.filter(
        (cart) =>
          // console.log(cart.qty);
          // console.log(cart.product_id, this.productId);
          cart.product_id === this.productId
      );
      return prodAry[0].qty;
    },
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

      // this.productQty = prodAry[0].qty;
      this.$refs.productModal.openModal();
    },

    // 取得購物車資料
    getCart() {
      const apiUrl = `/v2/api/${apiPath}/cart`;
      axios
        .get(`${site}${apiUrl}`, {})
        .then((res) => {
          // console.log('cart', res);
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
          // console.log('addToCart', res);
          this.alertSuccess(res.data.message);
          this.getCart();
          this.$refs.productModal.closeModal(); // 加入購物車後，關閉 modal
          this.isLoadingItem = '';
        })
        .catch((err) => {
          this.isLoadingItem = '';
          // console.error(err.data.message[0]);
          this.alertError(err.data.message[0]);
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
          this.alertSuccess(res.data.message);
          this.getCart();
          this.isLoadingItem = '';
        })
        .catch((err) => {
          this.isLoadingItem = '';
          console.error(err);
        });
    },

    // 更新購物車, PUT
    updateCartItem(item) {
      const apiUrl = `/v2/api/${apiPath}/cart/${item.id}`; // 這裡從整包物件裡拿 id(cart id)
      const data = {
        product_id: item.product_id, // product id
        qty: item.qty,
      };
      this.isLoadingItem = item.id;
      axios
        .put(`${site}${apiUrl}`, {
          data,
        })
        .then((res) => {
          // console.log('updateCartItem', item.id, res.data.data);
          this.alertSuccess(res.data.message);
          this.getCart();
          this.isLoadingItem = '';
        })
        .catch((err) => {
          this.isLoadingItem = '';
          console.error(err.response);
        });
    },

    // 清空購物車
    clearCarts() {
      const apiUrl = `/v2/api/${apiPath}/carts`;

      this.isLoading = true;
      axios
        .delete(`${site}${apiUrl}`)
        .then((res) => {
          // console.log('clearCarts', res);
          this.getCart();
          this.isLoading = false;
        })
        .catch((err) => {
          console.error(err.response);
        });
    },

    // validate rule for phone
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : '需要正確的電話號碼';
    },

    // alert message success，sweet alert
    alertSuccess(msg) {
      const swalSuccess = Swal.mixin({
        color: '#198754',
        confirmButtonColor: '#dc3545',
      });
      swalSuccess.fire({
        icon: 'success',
        title: msg,
        // text: 'Something went wrong!',
      });
    },

    // alert message error，sweet alert
    alertError(msg) {
      const swalError = Swal.mixin({
        color: '#495371',
        confirmButtonColor: '#dc3545',
      });
      swalError.fire({
        icon: 'error',
        title: msg,
        // text: 'Something went wrong!',
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
  props: ['id', 'prodQty'], // 取得 來自外層的 id
  template: '#userProductModal',
  data() {
    return {
      singleItemId: '',
      modal: {}, // 讓 methods 可以取用 modal
      product: {},
      qty: 1, // for 調整數量
    };
  },
  watch: {
    // id 改變時，取得該商品資料
    id(val, oldVal) {
      this.clearSingleProduct(); // 先清空，再取得該商品資料，避免彈出時還有舊圖片
      this.getProduct();
      // console.log(`val:${val}`, `oldVal:${oldVal}`);
    },
    prodQty() {},
  },
  methods: {
    // 開啟 modal
    openModal() {
      this.modal.show();
    },

    // 關閉 modal
    closeModal() {
      this.modal.hide();
    },

    // 在 product modal 取得遠端資料(code snippet from Hakka copy)
    getProduct() {
      // api for 取得單一品項資料
      const apiUrl = `/v2/api/${apiPath}/product/${this.id}`;
      axios
        .get(`${site}${apiUrl}`, {})
        .then((res) => {
          // console.log(res);
          this.product = res.data.product;
        })
        .catch((err) => {
          console.error(err.response);
        });
    },

    // 清除單筆資料
    clearSingleProduct() {
      this.product = {};
    },

    // productModal 裡的加入購物車，外層已經有了，使用外層的 addToCart
    addToCart() {
      // console.log(this.qty, this.product.id);
      this.$emit('add-cart', this.product.id, this.qty);
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal, {
      keyboard: false,
    });

    // modal 關閉事件
    // console.log(this.$refs.modal);
    // this.$refs.modal.addEventListener('hidden.bs.modal', (event) => {
    //   this.clearSingleProduct(); // ∵ modal 關閉時資料還在，∴ modal 關閉時清空資料
    //   console.log('close productModal');
    // });

    // test modal is usable or not
    // myModal.show();
  },
});

// 註冊 vee-validate 元件
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

// vue-loading-overlay
app.use(VueLoading.Plugin);
app.component('VLoading', VueLoading.Component);

app.mount('#app');
