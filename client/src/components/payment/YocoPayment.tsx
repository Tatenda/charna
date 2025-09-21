import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { usePopup } from "@lekkercommerce/yoco-react";

interface YocoPaymentProps {
  amount: number;
  customerInfo: any;
  cartItems: any[];
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

// Live Yoco payment integration using official SDK
const YocoPayment = ({ 
  amount, 
  customerInfo, 
  cartItems, 
  onSuccess, 
  onError, 
  disabled = false 
}: YocoPaymentProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Initialize Yoco SDK with test public key for safe testing
  const [showPopup, isYocoReady] = usePopup(import.meta.env.VITE_YOCO_TEST_PUBLIC_KEY);
  
  // Set up payment system as ready when Yoco SDK is initialized
  useEffect(() => {
    if (isYocoReady) {
      setPaymentId('yoco_ready');
      console.log('Yoco SDK ready for payment processing');
    }
  }, [isYocoReady]);

  const handlePayment = async () => {
    if (!isYocoReady || !paymentId) {
      onError('Payment system not ready. Please wait and try again.');
      return;
    }

    setIsProcessing(true);

    try {
      // Use Yoco SDK popup for secure payment processing
      showPopup({
        amountInCents: Math.round(amount * 100),
        currency: 'ZAR',
        callback: async (result) => {
          console.log('Yoco payment result:', result);
          
          if (result.error) {
            onError(result.error.message || 'Payment failed. Please try again.');
            setIsProcessing(false);
            return;
          }
          
          if (result.id && result.status === 'created') {
            // Process the payment token on our backend
            try {
              const response = await apiRequest('POST', '/api/payments/charge', {
                token: result.id,
                amountInCents: Math.round(amount * 100),
                currency: 'ZAR',
                customerInfo,
                metadata: {
                  itemCount: cartItems.length,
                  items: cartItems.map(item => ({
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price,
                    customizations: item.customizations
                  }))
                }
              });
              
              const payment = await response.json();
              console.log('Payment processed:', payment);
              
              toast({
                title: "Payment Successful!",
                description: "Your payment has been processed successfully.",
              });
              onSuccess(payment.id || result.id);
            } catch (error) {
              console.error('Failed to process payment:', error);
              onError('Payment processing failed. Please try again.');
              setIsProcessing(false);
              return;
            }
          } else if (result.status === 'cancelled') {
            // User cancelled - don't show error, just reset
            setIsProcessing(false);
            return;
          } else {
            onError('Payment failed. Please try again.');
            setIsProcessing(false);
          }
        },
        onClose: () => {
          console.log('Payment popup closed');
          setIsProcessing(false);
        },
      });

    } catch (error: any) {
      console.error('Payment processing error:', error);
      const errorMessage = error.message || 'Payment processing failed. Please try again.';
      onError(errorMessage);
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-semibold">Payment Details</h3>
          <div className="flex items-center text-green-600">
            <FontAwesomeIcon icon="shield-alt" className="mr-2" />
            <span className="text-sm font-medium">Secure Payment</span>
          </div>
        </div>

        <div className="space-y-3 text-sm mb-6">
          <div className="flex justify-between">
            <span className="text-neutral">Amount to Pay:</span>
            <span className="font-semibold text-lg">R{amount.toLocaleString()}</span>
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
            <FontAwesomeIcon icon={['fab', 'cc-visa']} className="text-xl text-blue-700" />
            <FontAwesomeIcon icon={['fab', 'cc-mastercard']} className="text-xl text-red-600" />
            <FontAwesomeIcon icon={['fab', 'cc-amex']} className="text-xl text-blue-500" />
            <span className="text-xs text-neutral-light">Secure payments powered by Yoco</span>
          </div>
        </div>
        
        {(!isYocoReady || !paymentId) && (
          <div className="text-center py-4">
            <FontAwesomeIcon icon="spinner" className="animate-spin text-2xl text-primary mb-2" />
            <p className="text-sm text-neutral">Loading secure payment system...</p>
          </div>
        )}
        
        {isYocoReady && paymentId && (
          <div className="text-center py-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <FontAwesomeIcon icon="shield-check" className="text-green-600 text-xl mb-2" />
              <h4 className="font-semibold text-green-800 mb-2">Secure Payment System</h4>
              <p className="text-sm text-green-700 leading-relaxed">
                Your payment will be processed securely through Yoco's encrypted payment system. 
                Use Yoco test card: 4000 0566 5566 5556 for testing - no real charges will be made.
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-700">
                <FontAwesomeIcon icon="check-circle" className="mr-2" />
                PCI Compliant tokenization would happen here
              </p>
            </div>
          </div>
        )}
      </div>

      <Button
        onClick={handlePayment}
        disabled={disabled || isProcessing || !isYocoReady || !paymentId}
        className="w-full btn-primary text-lg py-6"
        data-testid="button-pay-now"
      >
        {isProcessing ? (
          <>
            <FontAwesomeIcon icon="spinner" className="animate-spin mr-2" />
            Processing Payment...
          </>
        ) : (!isYocoReady || !paymentId) ? (
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
        Your payment information is encrypted and secure. 
        Powered by Yoco - South Africa's trusted payment provider.
      </div>
    </div>
  );
};

export default YocoPayment;