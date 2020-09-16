import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import "bootswatch/dist/darkly/bootstrap.min.css";
import "./App.css";
import axios from "axios";

const stripePromise = loadStripe(
  "pk_test_51HRo1SJ7z9RRZ9RDJjb9IiwR66AtDx6q662wcY7YYWwWeFjYa6kMxDvlhmNmky5T7ntm9aeooHiIvPpF10aNjDqS00fNtyGWoT"
);

const CheckoutForm = () => {
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    setLoading(true);
    if (!error) {
      const { id } = paymentMethod;
      const { data } = await axios.post("http://localhost:3001/api/checkout", {
        id,
        amount: 10000,
      });
      console.log(data);

      elements.getElement(CardElement).clear();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className='card card-body'>
      <img
        src='https://i0.pngocean.com/files/931/211/763/computer-mouse-razer-inc-razer-taipan-gamer-razer-naga-computer-mouse.jpg'
        alt='mouse gamer'
        className='img-fluid'
      />
      <h3 className='text-center my-2'>Price: 100$</h3>
      <div className='form-group'>
        <CardElement className='form-control' />
      </div>
      <button className='btn btn-success' disabled={!stripe}>
        {loading ? (
          <div className='spinner-border text-light' role='status'>
            <span className='sr-only'>Loading...</span>
          </div>
        ) : (
          "Buy"
        )}
      </button>
    </form>
  );
};

function App() {
  return (
    <Elements stripe={stripePromise}>
      <div className='container p-4'>
        <div className='row'>
          <div className='col-md-4 offset-md-4'>
            <CheckoutForm />
          </div>
        </div>
      </div>
    </Elements>
  );
}

export default App;
