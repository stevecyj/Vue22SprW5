import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';

const site = 'https://vue3-course-api.hexschool.io/v2';
const api_path = 'steve-vue';

let productModal = {};

const app = createApp({
  data() {
    // 這裡務必使用 function return
    return {
      // 先定義資料
      products: [],
      singleProduct: {
        imagesUrl: [],
      },
      isNew: false,
    };
  },
  methods: {
    // 獲得 token 資料
    checkLogin() {
      // 取得 Token (Token 僅需設定一次)
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, '$1');
      axios.defaults.headers.common['Authorization'] = token;

      const url = `${site}/api/user/check`;
      axios
        .post(url)
        .then((res) => {
          // console.log(res.data);
          this.getProducts();
        })
        .catch((err) => {
          console.log(err.response);
        });
    },

    // 取得左方列表
    getProducts() {
      const url = `${site}/api/${api_path}/admin/products/all`;

      axios
        .get(url)
        .then((res) => {
          // console.log(res.data);
          this.products = res.data.products;

          // 物件迴圈，to array
          Object.values(this.products).forEach((product) => {
            // console.log(product);
          });
        })
        .catch((err) => {
          console.log(err.response);
        });
    },

    // single product detail
    openProduct(item) {
      // console.log(item);
      this.singleProduct = item;
    },

    // open modal
    openModal(status, product) {
      this.isNew = true;
      if (status === 'edit') {
        // console.log(Object.entries(product));
        // for 開啟多圖條件
        Object.entries(product).forEach((item) => {
          this.singleProduct[item[0]] = item[1];
          // console.log(this.singleProduct);
        });
        this.isNew = false;
      }
      productModal.show();
    },

    // 新增、編輯產品
    updateProduct() {
      let url = `${site}/api/${api_path}/admin/product`;
      let method = 'post';

      if (!this.isNew) {
        url = `${site}/api/${api_path}/admin/product/${this.singleProduct.id}`;
        method = 'put';
      }

      axios[method](url, { data: this.singleProduct })
        .then((res) => {
          console.log(res.data);
          this.getProducts(); // 再拿一次 list
          productModal.hide(); // close modal
        })
        .catch((err) => {
          console.log(err.response);
        });
    },
  },
  mounted() {
    this.checkLogin();

    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false,
    });

    // ref for productModal
    this.$refs.productModal.addEventListener('hidden.bs.modal', (event) => {
      this.singleProduct = { imagesUrl: [] }; // productModal 關閉時清空資料
      this.getProducts();
    });
  },
});

// 使用 createApp 建立 Vue 應用，接下來使用 mount 掛載
app.mount('#app');
