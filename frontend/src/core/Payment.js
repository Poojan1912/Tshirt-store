import React, { useState, useEffect } from "react";
import { cartEmpty, loadCart } from "./helper/cartHelper";
import { Link } from "react-router-dom";
import { getMeToken, processPayment } from "./helper/paymentHelper";
import { createOrder } from "./helper/orderHelper";
import { isAutheticated } from "../auth/helper";
import DropIn from "braintree-web-drop-in-react";

const Payment = ({ products, setReload = (f) => f, reload = undefined }) => {
  const [info, setInfo] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {}
  });

  const userId = isAutheticated() && isAutheticated().user._id;
  const token = isAutheticated() && isAutheticated().token;

  const getToken = (userId, token) => {
    getMeToken(userId, token).then((info) => {
      console.log("Information", info);
      if (info.error) {
        setInfo({ ...info, error: info.error });
      } else {
        const clientToken = info.clientToken;
        setInfo({ clientToken: clientToken });
      }
    });
  };

  const showDropIn = () => {
    return (
      <div>
        {(info.clientToken !== null && products.length > 0) ? (
          <div>
            <DropIn
              options={{ authorization: info.clientToken }}
              onInstance={(instance) => (info.instance = instance)}
            />
            <button className="btn btn-success btn-block" onClick={onPurchase}>Buy</button>
          </div>
        ) : (<h4>Please login or add something to cart!</h4>)}
      </div>
    )
  }

  useEffect(() => {
    getToken(userId, token);
  }, []);

  const onPurchase = () => {
    try {
      setInfo({ loading: true })
      let nonce = null;
      let getNonce = info.instance.requestPaymentMethod().then(data => {
        nonce = data.nonce
        const paymentData = {
          paymentMethodNonce: nonce,
          amount: getAmount()
        };
        processPayment(userId, token, paymentData)
          .then((response) => {
            setInfo({ ...info, success: response.success, loading: false })
            console.log("Payment success");
            const orderData = {
              products: products,
              trasaction_id: response.transaction.id,
              amount: response.transaction.amount
            }
            createOrder(userId, token, orderData)
            //TODO: empty the cart
            cartEmpty(() => {
              console.log("Did we got a crash?");
            })
            //TODO: force reload
            setReload(!reload)
          })
          .catch(error => {
            setInfo({ loading: false, success: false })
            console.log("Payment failed");
          })
      })
    } catch (err) {
      console.log(err);
    }
  }

  const getAmount = () => {
    let amount = 0;
    products.map(product => {
      amount = amount + product.price;
    })
    return amount;
  }




  return (
    <div>
      <h3>Your Bill is ${getAmount()}</h3>
      {showDropIn()}
    </div>
  );
};

export default Payment;
