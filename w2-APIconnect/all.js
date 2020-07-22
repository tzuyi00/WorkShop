var obj = {
    data: {
      uuid: '19ab659b-8d43-427e-8552-6517262b063b',
      products: [],
    },
    getData: function() {
      var vm = this;
      var url = `https://course-ec-api.hexschool.io/api/${this.data.uuid}/ec/products`;
  
      axios.get(url)
        .then(function (response) {
            console.log(response);
            vm.data.products = response.data.data; //將取得的陣列放入products
            vm.render();
      })
    },
    render: function() {
      var app = document.getElementById('app');
      var products = this.data.products;
      var str = '';
      products.forEach(function(item) {
        str += `
        <div class="card">
        <img src="${ item.imageUrl[0] }" class="card-img-top">
        <div class="card-body">
        <h5 class="card-title">${ item.title }</h5>
        <span class="text-danger">NT$${ item.price }</span>
        <span class="card-text completed">NT$${ item.origin_price }</span> <br/>
        <button class="btn btn-dark mt-3 mx-auto">加入購物車</button>
        </div>
        </div>`;
      });
      app.innerHTML = str;
    }
  }
  
  obj.getData();
