/* global axios bootstrap */

// eslint-disable-next-line
import spinner from './spinner.js';

const site = 'https://vue3-course-api.hexschool.io';
const apiPath = 'steve-vue';

export default {
  template: `
            <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
                      aria-labelledby="exampleModalLabel" aria-hidden="true" ref="modal">
                    <div class="modal-dialog modal-xl" role="document">
                      <div class="modal-content border-0">
                        <div class="modal-header bg-dark text-white">
                          <h5 class="modal-title" id="exampleModalLabel">
                            <span>{{ product.title }}</span>
                        </h5>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                          <div class="row">
                            <div class="col-sm-6">
                              <img class="img-fluid" :src="product.imageUrl" alt="">
                        </div>
                            <div class="col-sm-6">
                              <span class="badge bg-primary rounded-pill">{{  }}</span>
                              <p>商品描述：{{ product.description }}</p>
                              <p>商品內容：{{ product.content }}</p>
                              <div class="h5" v-if="product.price===product.origin_price">{{ product.price }} 元</div>
                              <div v-else>
                                <del class="h6">原價 {{ product.origin_price }} 元</del>
                                <div class="h5">現在只要 {{ product.price }} 元</div>
                              </div>
                              <div>
                                <div class="input-group">
                                  <input type="number" class="form-control" min="1" v-model="qty">
                                  <button type="button" class="btn btn-primary" @click="addToCart">加入購物車</button>
                        </div>
                        </div>
                        </div>
                            <!-- col-sm-6 end -->
                        </div>
                        </div>
                        </div>
                        </div>
                        </div>
  `,
  props: ['id'], // 取得 來自外層的 id
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
};
