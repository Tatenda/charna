import { useLocation } from "wouter";
import Seo from "@/components/layout/Seo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/ui/button";

export default function CheckoutFailure() {
  const [, setLocation] = useLocation();

  return (
    <div className="bg-secondary-light min-h-screen">
      <Seo
        title="Payment Failed | Charna - Unable to Process Your Payment"
        description="We're sorry, but your payment could not be processed. Please try again or contact us for assistance."
        keywords="Charna payment failed, leather bag payment error, South African leather goods"
        url="/checkout/failure"
        robots="noindex, nofollow"
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Failure Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
              <FontAwesomeIcon
                icon="exclamation-triangle"
                className="text-red-600 text-4xl"
              />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-red-800 mb-4">
              Payment Failed
            </h1>
            <p className="text-xl text-neutral-600 mb-8">
              We're sorry, but your payment could not be processed at this time.
            </p>
          </div>

          {/* Information */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h3 className="font-heading text-lg font-semibold text-red-800 mb-3">
              What might have gone wrong?
            </h3>
            <ul className="text-left text-red-700 space-y-2">
              <li className="flex items-start">
                <FontAwesomeIcon
                  icon="credit-card"
                  className="text-red-600 mr-2 mt-1"
                />
                Insufficient funds in your account
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon
                  icon="shield-alt"
                  className="text-red-600 mr-2 mt-1"
                />
                Bank declined the transaction
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon
                  icon="wifi"
                  className="text-red-600 mr-2 mt-1"
                />
                Network connection issues
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon
                  icon="exclamation-circle"
                  className="text-red-600 mr-2 mt-1"
                />
                Invalid card details entered
              </li>
            </ul>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-heading text-lg font-semibold text-blue-800 mb-3">
              What you can do:
            </h3>
            <ul className="text-left text-blue-700 space-y-2">
              <li className="flex items-start">
                <FontAwesomeIcon
                  icon="check-circle"
                  className="text-blue-600 mr-2 mt-1"
                />
                Check your card details and try again
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon
                  icon="phone"
                  className="text-blue-600 mr-2 mt-1"
                />
                Contact your bank if the issue persists
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon
                  icon="envelope"
                  className="text-blue-600 mr-2 mt-1"
                />
                Reach out to us for assistance
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setLocation("/checkout")}
              className="btn-primary px-8 py-3"
            >
              <FontAwesomeIcon icon="credit-card" className="mr-2" />
              Try Payment Again
            </Button>
            <Button
              onClick={() => setLocation("/contact")}
              variant="outline"
              className="px-8 py-3"
            >
              <FontAwesomeIcon icon="envelope" className="mr-2" />
              Contact Support
            </Button>
          </div>

          {/* Contact Info */}
          <div className="mt-12 text-sm text-neutral-500">
            <p>Need immediate assistance? Contact us at:</p>
            <p className="font-medium">hello@charna.co.za</p>
            <p className="mt-2">We're here to help!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
