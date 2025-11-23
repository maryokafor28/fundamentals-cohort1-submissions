

const users = [];
const products = [];
const orders = [];

module.exports = {
  users,
  products,
  orders,
  
 
  reset() {
    users.length = 0;
    products.length = 0;
    orders.length = 0;
  }
};