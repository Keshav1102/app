import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext, CartContext } from '../App';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import { ShieldCheck } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51JxxxYourTestPublishableKeyHere');

const CheckoutForm = ({ address, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required'
      });

      if (error) {
        toast.error(error.message);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <PaymentElement data-testid="stripe-payment-element" />
      </div>
      
      <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
        <ShieldCheck className="h-4 w-4" />
        <span>Secure payment powered by Stripe</span>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || processing}
        data-testid="stripe-pay-button"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  );
};

const CheckoutPage = () => {
  const { token } = useContext(AuthContext);
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('address');
  const [clientSecret, setClientSecret] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA'
  });

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    
    if (!address.street || !address.city || !address.state || !address.zip) {
      toast.error('Please fill in all address fields');
      return;
    }

    try {
      // Create payment intent
      const response = await axios.post(
        `${API}/payment/create-intent`,
        { amount: cart.total },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setClientSecret(response.data.clientSecret);
      setCurrentStep('payment');
    } catch (error) {
      console.error('Failed to create payment intent:', error);
      toast.error('Failed to proceed to payment');
    }
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    try {
      const orderData = {
        items: cart.items,
        total: cart.total,
        address: address
      };

      const response = await axios.post(`${API}/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await clearCart();
      toast.success('Order placed successfully!');
      navigate('/profile?tab=orders');
    } catch (error) {
      console.error('Failed to create order:', error);
      toast.error('Order creation failed');
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Your cart is empty</p>
          <Button onClick={() => navigate('/catalog')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 bg-secondary/20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl md:text-4xl font-semibold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Main Content */}
          <div>
            <Tabs value={currentStep} onValueChange={setCurrentStep}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="address" data-testid="checkout-step-address">Address</TabsTrigger>
                <TabsTrigger value="payment" disabled={!clientSecret} data-testid="checkout-step-payment">Payment</TabsTrigger>
              </TabsList>

              <TabsContent value="address" className="mt-6">
                <Card className="p-6">
                  <h2 className="font-display text-xl font-semibold mb-4">Delivery Address</h2>
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div>
                      <Label>Street Address</Label>
                      <Input
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        placeholder="123 Main St"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>City</Label>
                        <Input
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          placeholder="New York"
                          required
                        />
                      </div>
                      <div>
                        <Label>State</Label>
                        <Input
                          value={address.state}
                          onChange={(e) => setAddress({ ...address, state: e.target.value })}
                          placeholder="NY"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>ZIP Code</Label>
                        <Input
                          value={address.zip}
                          onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                          placeholder="10001"
                          required
                        />
                      </div>
                      <div>
                        <Label>Country</Label>
                        <Input value={address.country} disabled />
                      </div>
                    </div>
                    <Button type="submit" className="w-full">Continue to Payment</Button>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="payment" className="mt-6">
                <Card className="p-6">
                  <h2 className="font-display text-xl font-semibold mb-4">Payment Details</h2>
                  {clientSecret && (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <CheckoutForm address={address} onSuccess={handlePaymentSuccess} />
                    </Elements>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card className="p-6">
              <h2 className="font-display text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {cart.items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span className="font-semibold tabular-nums">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 mb-3">
                <div className="flex justify-between text-sm mb-2">
                  <span>Subtotal</span>
                  <span className="tabular-nums">${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Shipping</span>
                  <span className="text-[hsl(161_93%_24%)]">FREE</span>
                </div>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="tabular-nums">${cart.total.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;