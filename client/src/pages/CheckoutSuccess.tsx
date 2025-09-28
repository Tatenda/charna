import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Seo from "@/components/layout/Seo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function CheckoutSuccess() {
  const [, setLocation] = useLocation();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [orderCreated, setOrderCreated] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [hasAttemptedOrderCreation, setHasAttemptedOrderCreation] = useState(false);
  const { cart, cartTotal, clearCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    console.log('=== CHECKOUT SUCCESS PAGE LOADED ===');
    console.log('Current cart:', cart);
    console.log('Order created:', orderCreated);
    console.log('Is creating order:', isCreatingOrder);
    
    // Get payment details from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const checkoutId = urlParams.get("checkoutId");
    const paymentId = urlParams.get("paymentId");
    
    console.log('URL params - checkoutId:', checkoutId, 'paymentId:', paymentId);


    if (checkoutId || paymentId) {
      setPaymentDetails({ checkoutId, paymentId });
      
      // Create order if we have payment details and cart items
      if (paymentId && cart.length > 0 && !orderCreated && !isCreatingOrder && !hasAttemptedOrderCreation) {
        setHasAttemptedOrderCreation(true);
        createOrderFromSuccess(paymentId);
      } else {
      }
    } else {
      console.log('No URL parameters found, using fallback mechanism...');
      
      // Fallback: If we have cart items but no payment ID, try to get checkout ID from localStorage
      if (cart.length > 0) {
        const storedCheckoutId = localStorage.getItem('lastCheckoutId');
        console.log('Stored checkout ID from localStorage:', storedCheckoutId);
        console.log('Has attempted order creation:', hasAttemptedOrderCreation);
        
        if (storedCheckoutId && !hasAttemptedOrderCreation) {
          console.log('Calling verifyPaymentFromCheckoutId with checkout ID:', storedCheckoutId);
          setHasAttemptedOrderCreation(true);
          verifyPaymentFromCheckoutId(storedCheckoutId);
        } else {
          console.log('Skipping fallback - no checkout ID or already attempted');
        }
      } else {
        console.log('No cart items, skipping fallback');
      }
    }
  }, [cart, orderCreated, isCreatingOrder, hasAttemptedOrderCreation]);

  const verifyPaymentFromCheckoutId = async (checkoutId: string) => {
    console.log('=== VERIFY PAYMENT FROM CHECKOUT ID ===');
    console.log('Checkout ID:', checkoutId);
    
    try {
      console.log('Making API request to:', `/api/checkouts/${checkoutId}`);
      
      // First, check the checkout status to see if it has a paymentId
      const checkoutResponse = await apiRequest("GET", `/api/checkouts/${checkoutId}`);
      console.log('API response status:', checkoutResponse.status);
      console.log('API response ok:', checkoutResponse.ok);
      
      const checkout = await checkoutResponse.json();
      console.log('Checkout response:', checkout);
      
      
      if (checkout && checkout.paymentId) {
        
        // Skip verification and create order directly with the paymentId
        await createOrderFromSuccess(checkout.paymentId);
      } else {
        
      }
    } catch (error) {
      console.error('Error in verifyPaymentFromCheckoutId:', error);
      toast({
        title: "Payment Verification Failed",
        description: "Could not verify payment status. Please contact support.",
        variant: "destructive"
      });
    }
    
  };

  const createOrderFromSuccess = async (paymentId: string) => {
    console.log('=== CREATE ORDER FROM SUCCESS ===');
    console.log('Payment ID:', paymentId);
    console.log('Cart items before order:', cart);
    
    setIsCreatingOrder(true);
    
    try {
      // Get customer info from localStorage (stored during checkout)
      const storedCustomerInfo = localStorage.getItem('checkoutCustomerInfo');
      
      if (!storedCustomerInfo) {
        toast({
          title: "Order Creation Failed",
          description: "Customer information not found. Please contact support.",
          variant: "destructive"
        });
        return;
      }

      const customerInfo = JSON.parse(storedCustomerInfo);
      const shippingCost = cartTotal >= 1000 ? 0 : 150;
      const totalAmount = cartTotal + shippingCost;


      const orderData = {
        customerInfo,
        items: cart.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          customizations: item.customizations
        })),
        totalAmount: totalAmount,
        paymentId: paymentId
      };


      // Create order with payment ID
      const response = await apiRequest("POST", "/api/orders", orderData);
      
      const order = await response.json();
      
      setOrderCreated(true);
      
      console.log('Order created successfully, clearing cart...');
      console.log('Cart before clearing:', cart);
      
      // Clear cart and stored customer info
      clearCart();
      localStorage.removeItem('checkoutCustomerInfo');
      
      console.log('Cart cleared and customer info removed from localStorage');
      
      
      toast({
        title: "Order Completed Successfully!",
        description: `Your order #${order.id} has been confirmed and paid.`,
      });
      
    } catch (error) {
      console.error('Order creation failed:', error);
      toast({
        title: "Order Creation Failed",
        description: "Payment successful but order creation failed. Please contact support.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <div className="bg-secondary-light min-h-screen">
      <Seo
        title="Payment Successful | Charna - Thank You for Your Purchase"
        description="Thank you for your purchase! Your payment has been processed successfully. Your premium leather bag will be crafted with care."
        keywords="Charna payment success, leather bag purchase complete, South African leather goods"
        url="/checkout/success"
        robots="noindex, nofollow"
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
              <FontAwesomeIcon
                icon="check"
                className="text-green-600 text-4xl"
              />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-green-800 mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-neutral-600 mb-8">
              Thank you for your purchase. Your payment has been processed
              successfully.
            </p>
          </div>

          {/* Payment Details */}
          {paymentDetails && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="font-heading text-xl font-semibold mb-4">
                Payment Details
              </h2>
              <div className="space-y-2 text-left">
                {paymentDetails.checkoutId && (
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Checkout ID:</span>
                    <span className="font-mono text-sm">
                      {paymentDetails.checkoutId}
                    </span>
                  </div>
                )}
                {paymentDetails.paymentId && (
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Payment ID:</span>
                    <span className="font-mono text-sm">
                      {paymentDetails.paymentId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h3 className="font-heading text-lg font-semibold text-green-800 mb-3">
              What happens next?
            </h3>
            <ul className="text-left text-green-700 space-y-2">
              <li className="flex items-start">
                <FontAwesomeIcon
                  icon="check-circle"
                  className="text-green-600 mr-2 mt-1"
                />
                You'll receive an email confirmation shortly
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon
                  icon="check-circle"
                  className="text-green-600 mr-2 mt-1"
                />
                Your leather bag will be handcrafted in our Johannesburg
                workshop
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon
                  icon="check-circle"
                  className="text-green-600 mr-2 mt-1"
                />
                We'll notify you when your order is ready for shipping
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setLocation("/")}
              className="btn-primary px-8 py-3"
            >
              <FontAwesomeIcon icon="home" className="mr-2" />
              Back to Home
            </Button>
            <Button
              onClick={() => setLocation("/products")}
              variant="outline"
              className="px-8 py-3"
            >
              <FontAwesomeIcon icon="shopping-bag" className="mr-2" />
              Browse More Products
            </Button>
          </div>

          {/* Contact Info */}
          <div className="mt-12 text-sm text-neutral-500">
            <p>Questions about your order? Contact us at:</p>
            <p className="font-medium">hello@charna.co.za</p>
          </div>
        </div>
      </div>
    </div>
  );
}
