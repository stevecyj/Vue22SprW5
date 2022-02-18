/* global axios VeeValidate VeeValidateRules VeeValidateI18n Vue VueLoading Swal */
// eslint-disable-next-line
// import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';
// 之前使用不同的 vue instance

// eslint-disable-next-line
import spinner from './components/spinner.js';
// eslint-disable-next-line
import productModal from './components/productModal.js';

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
  components: {
    spinner,
    productModal,
  },
  data() {
    return {
      cartData: {}, // cart 是拿整包資料
      products: [],
      productId: '',
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      isLoadingItem: '', // bootstrap loading
      isLoading: false, // vue-overlay loading
      fullPage: true, // vue-overlay fullPage
    };
  },
  computed: {},
  methods: {
    getProducts() {
      const apiUrl = `/v2/api/${apiPath}/products/all`;

      this.isLoading = true;
      axios
        .get(`${site}${apiUrl}`, {})
        .then((res) => {
          // console.log(res);
          this.isLoading = false;
          this.products = res.data.products;
        })
        .catch((err) => {
          this.isLoading = false;
          // console.error(err.response);
          this.alertError(err.data.message);
        });
    },

    openProductModal(id) {
      this.productId = id;
      this.$refs.productModal.openModal();
    },

    // 取得購物車資料
    getCart() {
      const apiUrl = `/v2/api/${apiPath}/cart`;
      // this.isLoading = true;
      axios
        .get(`${site}${apiUrl}`, {})
        .then((res) => {
          // console.log('cart', res);
          this.cartData = res.data.data;
          // this.isLoading = false;
        })
        .catch((err) => {
          // this.isLoading = false;
          // console.error(err.data.message);
          this.alertError(err.data.message);
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
          // console.error(err.data.message);
          this.alertError(err.data.message);
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
          // console.error(err);
          this.alertError(err.data.message);
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
          // console.error(err.data.message);
          this.alertError(err.data.message);
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
          this.alertSuccess(res.data.message);
          this.getCart();
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          // console.error(err.data.message);
          this.alertError(err.data.message);
        });
    },

    // 送出訂單
    submitOrder() {
      const apiUrl = `/v2/api/${apiPath}/order`;
      const data = this.form;
      this.isLoading = true;
      axios
        .post(`${site}${apiUrl}`, {
          data,
        })
        .then((res) => {
          // console.log('submitOrder', res);
          this.$refs.form.resetForm();
          this.alertSuccess(res.data.message);
          this.getCart();
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          // console.error(err.data.message);
          this.alertError(err.data.message);
        });
    },

    // validate rule for phone
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : '請填寫正確的手機號碼';
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

// 註冊 vee-validate 元件
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

// vue-loading-overlay
app.use(VueLoading.Plugin);
app.component('VLoading', VueLoading.Component);

app.mount('#app');
