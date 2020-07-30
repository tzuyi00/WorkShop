import zh from './zh_TW.js';

// 自定義設定檔案，錯誤的 className
VeeValidate.configure({
  classes: {
    valid: 'is-valid',
    invalid: 'is-invalid',
  },
});

// 載入自訂規則包
VeeValidate.localize('tw', zh);

// 將 VeeValidate input 驗證工具載入 作為全域註冊
Vue.component('ValidationProvider', VeeValidate.ValidationProvider);
// 將 VeeValidate 完整表單 驗證工具載入 作為全域註冊
Vue.component('ValidationObserver', VeeValidate.ValidationObserver);
// 掛載 Vue-Loading 套件
Vue.use(VueLoading);
// 全域註冊 VueLoading 並標籤設定為 loading
Vue.component('loading', VueLoading);

new Vue({
  el: '#app',
  data: {
    products: [],
    tempProduct: {
      num: 0,
    },
    status: {
      loadingItem: '',
    },
    form: {
      name: '',
      email: '',
      tel: '',
      address: '',
      payment: '',
      coupon: '',
      message: '',
    },
    cart: {},
    cartTotal: 0,
    isLoading: false,
    UUID: '19ab659b-8d43-427e-8552-6517262b063b',
    APIPATH: 'https://course-ec-api.hexschool.io',
  },
  created() {
    this.getProducts();
    this.getCart();
  },
  methods: {
    /**
     * 產品列表畫面
    */
    getProducts(page = 1) {
      this.isLoading = true;
      const url = `${this.APIPATH}/api/${this.UUID}/ec/products?page=${page}`;
      axios.get(url).then((response) => {
        console.log('產品列表',response);
        this.products = response.data.data;
        this.isLoading = false;
      }).catch(error => {        
        console.log(error);
        this.isLoading = false;
      });
    },
    /**
     * 購物車畫面
    */
    getCart() {
      this.isLoading = true;
      const url = `${this.APIPATH}/api/${this.UUID}/ec/shopping`;

      axios.get(url).then((response) => {
        console.log('購物車',response);
        this.cart = response.data.data;
        // 購物車金額拉出來重新計算，不然刪除時會出錯造成累加
        this.updateTotal();
        this.isLoading = false;
      });
    },
    /**
     * 總金額計算
    */
    updateTotal() {
      this.cart.forEach((item) => {
        this.cartTotal += item.product.price * item.quantity;
      });
    },
    /**
     * 取得單一商品資訊
    */
    getDetailed(id) {
      this.status.loadingItem = id;

      const url = `${this.APIPATH}/api/${this.UUID}/ec/product/${id}`;

      axios.get(url).then((response) => {
        this.tempProduct = response.data.data;
        // 由於 tempProduct 的 num 沒有預設數字
        // 因此 options 無法選擇預設欄位，故要增加這一行解決該問題
        // 另外如果直接使用物件新增屬性進去是會雙向綁定失效，因此需要使用 $set
        this.$set(this.tempProduct, 'num', 1);
        $('#productModal').modal('show');
        this.status.loadingItem = '';
      });
    },
    /**
     * 加入購物車
    */
    addToCart(item, quantity = 1) {
      this.status.loadingItem = item.id;

      const url = `${this.APIPATH}/api/${this.UUID}/ec/shopping`;

      const cart = {
        product: item.id,
        quantity,
      };

      axios.post(url, cart).then(() => {
        this.status.loadingItem = '';
        $('#productModal').modal('hide');
        this.getCart();
      }).catch((error) => {
        this.status.loadingItem = '';
        console.log(error.response.data.errors);
        $('#productModal').modal('hide');
      });
    },
    /**
     * 編輯商品數量
    */
    quantityUpdata(id, num) {
      if(num <= 0) return; // 避免商品數量低於 0 個

      this.isLoading = true;
      const url = `${this.APIPATH}/api/${this.UUID}/ec/shopping`;

      const data = {
        product: id,
        quantity: num,
      };

      axios.patch(url, data).then(() => {
        this.isLoading = false;
        this.getCart();
      });
    },
    /**
     * 清空購物車
    */
    removeAllCartItem() {
      this.isLoading = true;
      const url = `${this.APIPATH}/api/${this.UUID}/ec/shopping/all/product`;

      axios.delete(url)
        .then(() => {
          this.isLoading = false;
          this.getCart();
        });
    },
    /**
     * 刪除某一筆購物車資料
    */
    removeCartItem(id) {
      this.isLoading = true;
      const url = `${this.APIPATH}/api/${this.UUID}/ec/shopping/${id}`;

      axios.delete(url).then(() => {
        this.isLoading = false;
        this.getCart();
      });
    },
    /**
     * 新增一筆訂單
    */
    createOrder() {
      this.isLoading = true;
      const url = `${this.APIPATH}/api/${this.UUID}/ec/orders`;

      axios.post(url, this.form).then((response) => {
        console.log('訂單回傳資料',response);

        if (response.data.data.id) { //確保資料送出之後回傳有建立成功
          this.isLoading = false;
          $('#orderModal').modal('show');// 跳出提示訊息
          this.getCart();// 重新渲染購物車
        }
      }).catch((error) => {
        this.isLoading = false;
        console.log(error.response.data.errors);
      });
    },
  },
});