import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';

const site = 'https://vue3-course-api.hexschool.io/v2';

const app = createApp({
  data() {
    // 這裡務必使用 function return
    return {
      user: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    login() {
      const url = `${site}/admin/signin`;
      axios
        .post(url, this.user)
        .then((res) => {
          // 取出 token, 到期日
          const { token, expired } = res.data;
          document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
          window.location = './productlist.html';
        })
        .catch((err) => {
          console.log(err.response);
        });
    },
  },
  mounted() {},
});

// 使用 createApp 建立 Vue 應用，接下來使用 mount 掛載
app.mount('#app');
