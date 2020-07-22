export default {
    template:'#productModalTemplate',
    data() {
        return {
        };
    },
    props: {
        tempProduct: {
            imageUrl: [],
        },
        status: {},
        isNew: '',
        user: {},
    },
    methods: {
        /**
         * 上傳產品資料
         * 透過 this.isNew 的狀態將會切換新增產品或編輯產品。
         * 附註新增為「post」編輯則是「patch」，patch 必須傳入產品 ID
         */
        updateProduct() {
            console.log(this.isNew);
            let api = '';
            let httpMethod = '';
            if (this.isNew) {
                // 新增商品
                api = `${this.user.path}${this.user.uuid}/admin/ec/product`;
                httpMethod = 'post';
            }else { 
                // 編輯商品
                api = `${this.user.path}${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;
                httpMethod = 'patch';
            }
            
            // 用 httpMethod 帶入是用post還是patch
            axios[httpMethod](api, this.tempProduct).then(() => {
                $('#productModal').modal('hide'); // AJAX 新增成功後關閉 Modal
                this.$emit('update'); // 重新取得全部產品資料(更新畫面)
            }).catch((error) => {
                console.log(error) // 若出現錯誤則顯示錯誤訊息
            });
        },

        /**
         * 上傳圖片
         *  @param fileUploading 控制spinner icon出現
         */
        uploadFile() {
            // 選取 DOM 中的檔案資訊
            const uploadedFile = this.$refs.file.files[0]; 
    
            // 使用 FormData 上傳檔案
            const formData = new FormData();
            formData.append('file', uploadedFile);
    
            const url = `${this.user.path}${this.user.uuid}/admin/storage`;
    
            this.status.fileUploading = true;
    
            axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', //聲明此內容的要用formData格式
            },
            }).then((response) => {
            this.status.fileUploading = false;
            // 200上傳成功
            if (response.status === 200) {
                this.tempProduct.imageUrl.push(response.data.data.path);
            }
            }).catch(() => {
            console.log('上傳不可超過 2 MB');
            this.status.fileUploading = false;
            });
        },
    },
}