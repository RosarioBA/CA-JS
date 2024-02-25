// the cart will map movieId to count of that movie in the cart

// get information about cart
function getCart() {
	cart = localStorage.getItem("cart") || "{}";
	return JSON.parse(cart);
}

function saveCart(cart) {
	localStorage.setItem("cart", JSON.stringify(cart));
}

function clearCart() {
	localStorage.removeItem("cart");
}

function addOneToCart(movieId) {
  cart = getCart();
  cart[movieId] ||= 0;
  cart[movieId] += 1
  saveCart(cart);
}

function removeOneFromCart(movieId) {
  cart = getCart();
  cart[movieId] ||= 0;
  if (cart[movieId] > 0) {
    cart[movieId] -= 1;
    if (cart[movieId] == 0) {
      delete cart[movieId];
    }
    saveCart(cart);
  } else { /* we could have decided to throw an error here, but prefer not for now */ }
}

function removeAllFromCart(movieId) {
  cart = getCart();
  delete cart[movieId];
  saveCart(cart);
}

function displayCart(msg) {
	cart = getCart();
	count = Object.keys(cart).length;
	console.log(`${msg}, cart has ${count} movie(s)`);
	Object.keys(cart).forEach(function (id) { 
      var count = cart[id]
      console.log(`  Movie ${id} has count ${count}`);
   })
}


// test code
runTestCode = false
if (runTestCode) {
    clearCart();
    displayCart("at start");
    addOneToCart(1)
    displayCart("after adding 1");
    addOneToCart(1)
    displayCart("after adding 1 again");
    addOneToCart(2)
    displayCart("after adding 2");
    removeOneFromCart(2)
    displayCart("after removing 2");
    removeOneFromCart(2)
    displayCart("after removing 2 again");
    removeAllFromCart(1)
    displayCart("after removing all 1");
}

