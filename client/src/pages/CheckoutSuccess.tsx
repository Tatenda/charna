import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Seo from "@/components/layout/Seo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccess() {
  const [, setLocation] = useLocation();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    // Get payment details from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const checkoutId = urlParams.get("checkoutId");
    const paymentId = urlParams.get("paymentId");

    if (checkoutId || paymentId) {
      setPaymentDetails({ checkoutId, paymentId });
    }
  }, []);

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
