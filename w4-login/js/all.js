/**
 * Vue 說明
 * 這邊不加上 const app = new Vue 並沒有任何影響。
 */
import pagination_file from './pagination.js';
import productModal_file from './productModal.js';
import delModal_file from './delModal.js';

Vue.component('pagination_com', pagination_file);
Vue.component('product_modal_com', productModal_file);
Vue.component('del_modal_com', delModal_file);


new Vue({
  el: '#app', // Vue 綁定在 app。
  /**
   * Vue data 說明
   * @param products 放置 AJAX 回來的產品資料。
   * @param pagination 放置分頁資料用。
   * @param tempProduct 暫存資料用，必須預先定義 imageUrl 並且是一個陣列，否則新增或更新會出現錯誤。
   * @param isNew 用於判斷接下來的行為是新增產品或編輯產品。
   * @param status 用於切換上傳圖片時的小 icon，主要是增加使用者體驗。
   * @param user 底下分別有 token 的放置處，但主要必須注意 uuid 需改成自己的，目前是助教示範用。
   */
  data: {
    products: [],
    pagination: {},
    tempProduct: {
      imageUrl: [],
    },
    isNew: false,
    status: {
      fileUploading: false, 
    },
    loadingBtn: '',
    user: {
      token: '',
      uuid: '19ab659b-8d43-427e-8552-6517262b063b',
      path: 'https://course-ec-api.hexschool.io/api/',
    },
  },
  /**
   * 生命週期 Created
   * 主要用於取得 token 若使用者沒有 token 則返回到登入畫面，若有則執行「取得全部產品」的方法。
   */
  created() {
    // 取得 cookie 的 token，詳情請見：https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie
    this.user.token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    // 將 Token 夾帶入 Headers 內，全部放在此就好，不用每個methods都放
    axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`; 

    // 若無法取得 token 則返回 Login 頁面
    if (this.user.token === '') {
      window.location = 'Login.html';
    }
    // 執行取得全部產品的行為
    this.getProducts();
  },
  methods: {
    /**
     * 取得全部產品，每更新畫面皆會使用
     * @param page 頁碼，預設值是第一頁(若沒帶值則為 1 )
     */
    getProducts(page = 1) {
      const api = `${this.user.path}${this.user.uuid}/admin/ec/products?page=${page}`;

      axios.get(api).then((response) => {
        console.log(response);
        this.products = response.data.data; // 取得產品列表
        this.pagination = response.data.meta.pagination; // 取得分頁資訊
      });
    },

    /**
     * 開啟 Modal 視窗
     * @param isNew 判斷目前是否為新增(true)或是編輯(false)
     * @param item 物件，主要用於傳入要編輯或刪除的產品資料
     * @param loadingBtn 判斷loading效果
     */
    openModal(modalStatus, item) {
      switch (modalStatus) {
        case 'new':          
          this.tempProduct = { imageUrl: [], }; // 新增之前必須先清除原有可能暫存的資料
          this.isNew = true; // 切換狀態為 true 代表新增
          $('#productModal').modal('show'); // 切換完畢並清空資料後開啟 Modal
          break;
        case 'edit':
          this.loadingBtn = item.id; //當loadingBtn = item.id時顯示loading畫面
          const api = `${this.user.path}${this.user.uuid}/admin/ec/product/${item.id}`;
          // 取得單一詳細產品資料
          axios.get(api).then((res) => {
            this.tempProduct = res.data.data; // 取得成功後回寫到 tempProduct
            $('#productModal').modal('show'); // 確保資料已經回寫後再打開 Modal
            this.loadingBtn = ''; //清除loading畫面
          }).catch((error) => {
            console.log(error); 
          });
          this.isNew = false;// 切換狀態為 false 代表編輯
          break;
        case 'delete':          
          this.tempProduct = Object.assign({}, item); // 由於目前範本僅有一層物件，因此使用淺拷貝
          $('#delProductModal').modal('show');
          break;
        default:
          break;
      }
    },
  },
})