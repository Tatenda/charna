import { useRouter } from "next/router";
import Seo from "@/components/layout/Seo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/ui/button";

export default function CheckoutCancel() {
  const router = useRouter();

  return (
    <div className="bg-secondary-light min-h-screen">
      <Seo
        title="Payment Cancelled | Charna - Your Order Was Not Processed"
        description="Your payment was cancelled. No charges have been made. You can continue shopping or try again."
        keywords="Charna payment cancelled, leather bag order cancelled, South African leather goods"
        url="/checkout/cancel"
        robots="noindex, nofollow"
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Cancel Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-100 rounded-full mb-6">
              <FontAwesomeIcon
                icon="times"
                className="text-yellow-600 text-4xl"
              />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-yellow-800 mb-4">
              Payment Cancelled
            </h1>
            <p className="text-xl text-neutral-600 mb-8">
              Your payment was cancelled and no charges have been made to your
              account.
            </p>
          </div>

          {/* Information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="font-heading text-lg font-semibold text-yellow-800 mb-3">
              What happened?
            </h3>
            <ul className="text-left text-yellow-700 space-y-2">
              <li className="flex items-start">
                <FontAwesomeIcon
                  icon="info-circle"
                  className="text-yellow-600 mr-2 mt-1"
                />
                You cancelled the payment process
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon
                  icon="shield-check"
                  className="text-yellow-600 mr-2 mt-1"
                />
                No money has been charged to your account
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon
                  icon="shopping-cart"
                  className="text-yellow-600 mr-2 mt-1"
                />
                Your items are still in your cart
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push("/checkout")}
              className="btn-primary px-8 py-3"
            >
              <FontAwesomeIcon icon="credit-card" className="mr-2" />
              Try Payment Again
            </Button>
            <Button
              onClick={() => router.push("/cart")}
              variant="outline"
              className="px-8 py-3"
            >
              <FontAwesomeIcon icon="shopping-cart" className="mr-2" />
              Review Cart
            </Button>
          </div>

          {/* Contact Info */}
          <div className="mt-12 text-sm text-neutral-500">
            <p>Need help with your order? Contact us at:</p>
            <p className="font-medium">hello@charna.co.za</p>
          </div>
        </div>
      </div>
    </div>
  );
}
