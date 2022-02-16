import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';
import pagination from './pagination.js';
import deleteProductModal from './delProductModal.js';

const site = 'https://vue3-course-api.hexschool.io/v2';
const api_path = 'steve-vue';

// 建立 Modal
let productModal = {};
let delProductModal = {};

const app = createApp({
  components: {
    pagination,
    deleteProductModal,
  },
  data() {
    // 這裡務必使用 function return
    return {
      // 先定義資料
      products: [],
      singleProduct: {
        imagesUrl: [],
      },
      isNew: false,
      pagination: {}, // 分頁資料
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

    // 取得列表
    getProducts(page = 1) {
      // query 參數
      const url = `${site}/api/${api_path}/admin/products/?page=${page}`;

      axios
        .get(url)
        .then((res) => {
          // console.log(res.data);
          this.products = res.data.products;

          // 物件迴圈，to array
          Object.values(this.products).forEach((product) => {
            // console.log(product);
          });

          // 分頁資料
          this.pagination = res.data.pagination;
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

    // open modal，判斷新增或編輯
    openModal(status, product) {
      switch (status) {
        case 'isNew':
          this.isNew = true;
          productModal.show();
          break;
        case 'edit':
          // for 開啟多圖條件
          Object.entries(product).forEach((item) => {
            this.singleProduct[item[0]] = item[1];
            // console.log(this.singleProduct);
          });
          this.isNew = false;
          productModal.show();
          break;
        case 'delete':
          delProductModal.show();
          this.singleProduct = { ...product };
          break;
        default:
          break;
      }
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

    // 刪除產品
    delProduct() {
      let url = `${site}/api/${api_path}/admin/product/${this.singleProduct.id}`;
      let method = 'delete';

      axios[method](url)
        .then((res) => {
          console.log(res.data);
          this.getProducts(); // 再拿一次 list
          delProductModal.hide(); // close modal
        })
        .catch((err) => {
          console.log(err.response);
        });
    },

    // 清除單筆資料
    clearSingleProduct() {
      this.singleProduct = { imagesUrl: [] };
    },
  },
  mounted() {
    this.checkLogin();

    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false,
    });

    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false,
    });
  },
});

app.component('productModal', {
  props: ['singleProduct', 'isNew', 'pages'],
  template: `#templateForProductModal`,
  data() {
    return {
      innerProduct: {
        imagesUrl: [],
      },
    };
  },
  methods: {
    // 刪除單張圖片
    delImg(key) {
      // console.log(key);
      this.singleProduct.imagesUrl.splice(key, 1);
    },
  },
  mounted() {
    // ref for productModal
    this.$refs.productModal.addEventListener('hidden.bs.modal', (event) => {
      this.$emit('clear-single-product'); // productModal 關閉時清空資料
      this.$emit('get-products', this.pages.current_page);
      // console.log('close productModal');
    });
  },
});

// 使用 createApp 建立 Vue 應用，接下來使用 mount 掛載
app.mount('#app');
