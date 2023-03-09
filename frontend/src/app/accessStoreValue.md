# ACCESS STORE VALUE

- create components/Navbar.js

```js
import { useSelector } from "react-redux";

const Navbar = () => {
  //.cart is a name of store properties
  //distruc
  const { amount } = useSelector((state) => state.cart);
};

return (
  <nav>
    <p>{amount}</p>
  </nav>
);
```
