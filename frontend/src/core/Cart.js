import React, { useState, useEffect } from "react";
import "../styles.css";
import Base from "./Base";
import Card from "./Card";
import { loadCart } from "./helper/cartHelper";
import Payment from "./Payment";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);
  useEffect(() => {
    setProducts(loadCart());
  }, [reload]);

  const loadAllProducts = (products) => {
    return (
      <div>
        <h2>This section is to load products</h2>
        {products.map((product, index) => (
          <Card
            key={index}
            product={product}
            removeFromCart={true}
            addtoCart={false}
            setReload={setReload}
            reload={reload}
          />
        ))}
      </div>
    );
  };

  return (
    <Base title="Your Cart" description="Ready to checkout">
      <div className="row text-center">
        <div className="col-6">
          {products.length === 0 && <h4>No products in cart.</h4>}
          {products.length > 0 && loadAllProducts(products)}
        </div>
        <div className="col-6">
          <h4><Payment products={products} setReload={setReload} /></h4>
        </div>
      </div>
    </Base>
  );
};

export default Cart;
