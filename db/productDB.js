class ProductDB {
  constructor (){
    this.products = [];
  }

  remove(id){
    this.products.forEach((product, index, array) => {
      console.log('for looping');
      if(product.id === id){
        array.splice(index, 1);
        console.log('found and deleted');
      }
    });
  }
}

module.exports = new ProductDB();