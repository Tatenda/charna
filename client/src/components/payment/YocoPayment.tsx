import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface YocoPaymentProps {
  amount: number;
  customerInfo: any;
  cartItems: any[];
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

// Live Yoco payment integration using official SDK
const YocoPaymentInner = ({
  amount,
  customerInfo,
  cartItems,
  onSuccess,
  onError,
  disabled = false,
  checkoutId,
}: YocoPaymentProps & { checkoutId: string }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Get the redirect URL for this checkout
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [isLoadingRedirect, setIsLoadingRedirect] = useState(false);

  // Fetch the checkout details to get the redirect URL
  useEffect(() => {
    if (!checkoutId) return;

    const fetchCheckoutDetails = async () => {
      try {
        setIsLoadingRedirect(true);
        const response = await apiRequest(
          "GET",
          `/api/checkouts/${checkoutId}`,
        );
        const checkout = await response.json();

        if (checkout?.redirectUrl) {
          setRedirectUrl(checkout.redirectUrl);
          console.log("Checkout redirect URL:", checkout.redirectUrl);
        } else {
          onError("Failed to get payment URL. Please try again.");
        }
      } catch (error) {
        console.error("Failed to fetch checkout details:", error);
        onError("Failed to initialize payment. Please try again.");
      } finally {
        setIsLoadingRedirect(false);
      }
    };

    fetchCheckoutDetails();
  }, [checkoutId, onError]);

  const handlePayment = () => {
    if (!redirectUrl) {
      onError("Payment URL not ready. Please wait and try again.");
      return;
    }

    setIsProcessing(true);

    // Redirect to Yoco checkout page
    window.location.href = redirectUrl;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-semibold">
            Payment Details
          </h3>
          <div className="flex items-center text-green-600">
            <FontAwesomeIcon icon="shield-alt" className="mr-2" />
            <span className="text-sm font-medium">Secure Payment</span>
          </div>
        </div>

        <div className="space-y-3 text-sm mb-6">
          <div className="flex justify-between">
            <span className="text-neutral">Amount to Pay:</span>
            <span className="font-semibold text-lg">
              R{amount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral">Payment Method:</span>
            <span className="font-medium">Secure Card Payment</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral">Processing:</span>
            <span className="font-medium">PCI Compliant</span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 mb-6">
          <div className="flex flex-wrap gap-2 items-center">
            <FontAwesomeIcon
              icon={["fab", "cc-visa"]}
              className="text-xl text-blue-700"
            />
            <FontAwesomeIcon
              icon={["fab", "cc-mastercard"]}
              className="text-xl text-red-600"
            />
            <FontAwesomeIcon
              icon={["fab", "cc-amex"]}
              className="text-xl text-blue-500"
            />
            <span className="text-xs text-neutral-light">
              Secure payments powered by Yoco
            </span>
          </div>
        </div>

        {isLoadingRedirect && (
          <div className="text-center py-4">
            <FontAwesomeIcon
              icon="spinner"
              className="animate-spin text-2xl text-primary mb-2"
            />
            <p className="text-sm text-neutral">
              Loading secure payment system...
            </p>
          </div>
        )}

        {!isLoadingRedirect && redirectUrl && (
          <div className="text-center py-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <FontAwesomeIcon
                icon="shield-check"
                className="text-green-600 text-xl mb-2"
              />
              <h4 className="font-semibold text-green-800 mb-2">
                Secure Payment System
              </h4>
              <p className="text-sm text-green-700 leading-relaxed">
                Your payment will be processed securely through Yoco's encrypted
                payment system. Use test card: 4111 1111 1111 1111 (Exp: 12/25,
                CVV: 123) for testing - no real charges will be made.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-700">
                <FontAwesomeIcon icon="check-circle" className="mr-2" />
                You will be redirected to Yoco's secure payment page
              </p>
            </div>
          </div>
        )}
      </div>

      <Button
        onClick={handlePayment}
        disabled={disabled || isProcessing || isLoadingRedirect || !redirectUrl}
        className="w-full btn-primary text-lg py-6"
        data-testid="button-pay-now"
      >
        {isProcessing ? (
          <>
            <FontAwesomeIcon icon="spinner" className="animate-spin mr-2" />
            Redirecting to Payment...
          </>
        ) : isLoadingRedirect ? (
          <>
            <FontAwesomeIcon icon="spinner" className="animate-spin mr-2" />
            Loading Payment System...
          </>
        ) : (
          <>
            <FontAwesomeIcon icon="credit-card" className="mr-2" />
            Pay R{amount.toLocaleString()} Now
          </>
        )}
      </Button>

      <div className="text-xs text-neutral-light text-center">
        <FontAwesomeIcon icon="lock" className="mr-1" />
        Your payment information is encrypted and secure. Powered by Yoco -
        South Africa's trusted payment provider.
      </div>
    </div>
  );
};

// Wrapper component that handles checkout creation
const YocoPayment = ({
  amount,
  customerInfo,
  cartItems,
  onSuccess,
  onError,
  disabled = false,
}: YocoPaymentProps) => {
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Create checkout session when component mounts (only once)
  useEffect(() => {
    const createCheckoutSession = async () => {
      if (checkoutId || isCreatingCheckout) return; // Already created or in progress

      setIsCreatingCheckout(true);
      setCheckoutError(null);

      try {
        console.log(
          "Creating checkout session for amount:",
          Math.round(amount * 100),
          "cents",
        );
        const response = await apiRequest("POST", "/api/payments/create", {
          amountInCents: Math.round(amount * 100),
          currency: "ZAR",
          customerInfo,
          metadata: {
            itemCount: cartItems.length,
            items: cartItems.map((item) => ({
              name: item.product.name,
              quantity: item.quantity,
              price: item.product.price,
              customizations: item.customizations,
            })),
          },
        });

        const checkout = await response.json();
        console.log("Checkout session created successfully:", checkout.id);
        setCheckoutId(checkout.id);
      } catch (error) {
        console.error("Failed to create checkout session:", error);
        const errorMessage =
          "Failed to initialize payment system. Please try again.";
        setCheckoutError(errorMessage);
        onError(errorMessage);
      } finally {
        setIsCreatingCheckout(false);
      }
    };

    createCheckoutSession();
    // Only create checkout session once - removing dynamic dependencies that cause re-creation
  }, []);

  if (isCreatingCheckout) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center py-8">
            <FontAwesomeIcon
              icon="spinner"
              className="animate-spin text-2xl text-primary mb-2"
            />
            <p className="text-sm text-neutral">
              Initializing secure payment...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (checkoutError) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center py-8">
            <FontAwesomeIcon
              icon="exclamation-triangle"
              className="text-red-500 text-2xl mb-2"
            />
            <p className="text-sm text-red-600">{checkoutError}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4"
              data-testid="button-retry"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!checkoutId) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center py-8">
            <FontAwesomeIcon
              icon="spinner"
              className="animate-spin text-2xl text-primary mb-2"
            />
            <p className="text-sm text-neutral">Loading payment system...</p>
          </div>
        </div>
      </div>
    );
  }

  // Only render the actual payment component when we have a valid checkout ID
  return (
    <YocoPaymentInner
      amount={amount}
      customerInfo={customerInfo}
      cartItems={cartItems}
      onSuccess={onSuccess}
      onError={onError}
      disabled={disabled}
      checkoutId={checkoutId}
    />
  );
};

export default YocoPayment;
