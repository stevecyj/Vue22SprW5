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
    };
  },
  methods: {
    getProducts() {
      const apiUrl = `/v2/api/${apiPath}/products/all`;
      axios
        .get(`${site}${apiUrl}`, {})
        .then((res) => {
          console.log(res);
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
  },
  mounted() {
    this.getProducts();
  },
});

// product modal, $refs
app.component('product-modal', {
  props: ['id'],
  template: '#userProductModal',
  data() {
    return {
      modal: {}, // 讓 methods 可以取用 modal
    };
  },
  methods: {
    // 開啟 modal
    openModal() {
      this.modal.show();
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal, {
      keyboard: false,
    });

    // test modal is usable or not
    // myModal.show();
  },
});

app.mount('#app');
