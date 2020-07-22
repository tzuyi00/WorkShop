export default {
  template:'#paginationTemplate',

  data() {
    return {
    };
  },

  /**
   * props 說明
   * 主要接受由外(Products)向內(pagination)傳遞的分頁物件，意指在 getProducts 取得的分頁物件
   */
  props: {
    pages: {},
  },
  methods: {
    /**
     * 每點擊分頁按鈕都會觸發emitPage()，並帶入目前頁數
     * @param item 是你點擊的分頁按鈕，當你點第二頁就會傳入二，點第五頁就會傳入五以此類推
     */
    emitPages(item) {
      console.log('item',item);
      // 透過 emit 向外傳遞我們點的分頁並觸發外層的 getProducts
      this.$emit('emit-pages', item);
    },
  },
}

