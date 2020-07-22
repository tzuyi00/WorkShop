export default {
    template:'#delModalTemplate',
    data() {
        return {
        };
    },
    props: {
        tempProduct: {
            imageUrl: [],
        },
        user: {},
    },
    methods: {
        /**
         * 刪除產品
         * 透過在 openModal 傳入的 this.tempProduct，並撈取 this.tempProduct.id 來刪除產品。
         * 主要是因為在 delModal 會使用到產品的一些資訊，因此會需要拷貝一整份過來。
        */
        delProduct() {
            const url = `${this.user.path}${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;
    
            axios.delete(url).then(() => {
            $('#delProductModal').modal('hide'); // 刪除成功後關閉 Modal
            this.$emit('update'); // 重新取得全部資料(更新畫面)
            });
        },
    }
}