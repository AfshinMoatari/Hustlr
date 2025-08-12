// Retrieve initial state from localStorage if available
const getInitialCart = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : [];
};

const handleCart = (state = getInitialCart(), action) => {
  const product = action.payload;
  let updatedCart;

  switch (action.type) {
    case "ADDITEM":
      // Treat a product with a different variant as a separate line item
      const getKey = (item) => `${item.id}::${item.variant ?? "_"}`;
      const exist = state.find((x) => getKey(x) === getKey(product));
      if (exist) {
        // Increase the quantity
        updatedCart = state.map((x) =>
          getKey(x) === getKey(product) ? { ...x, qty: x.qty + 1 } : x
        );
      } else {
        updatedCart = [...state, { ...product, qty: 1 }];
      }
      // Update localStorage
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;

    case "DELITEM":
      const getKey2 = (item) => `${item.id}::${item.variant ?? "_"}`;
      const exist2 = state.find((x) => getKey2(x) === getKey2(product));
      if (exist2.qty === 1) {
        updatedCart = state.filter((x) => getKey2(x) !== getKey2(exist2));
      } else {
        updatedCart = state.map((x) =>
          getKey2(x) === getKey2(product) ? { ...x, qty: x.qty - 1 } : x
        );
      }
      // Update localStorage
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;

    default:
      return state;
  }
};

export default handleCart;
