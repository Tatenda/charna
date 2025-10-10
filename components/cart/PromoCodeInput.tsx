import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiRequest } from '@/lib/queryClient';
import { PromoCodeValidationResponse } from '@/shared/types';

interface PromoCodeInputProps {
  orderTotal: number;
  customerEmail?: string;
  onPromoApplied: (code: string, discount: number, promoCodeId?: number) => void;
  onPromoRemoved: () => void;
  appliedPromoCode?: string;
  appliedDiscount?: number;
}

const PromoCodeInput = ({
  orderTotal,
  customerEmail,
  onPromoApplied,
  onPromoRemoved,
  appliedPromoCode,
  appliedDiscount
}: PromoCodeInputProps) => {
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleApplyCode = async () => {
    if (!code.trim()) {
      setMessage({ type: 'error', text: 'Please enter a promo code' });
      return;
    }

    setIsValidating(true);
    setMessage(null);

    try {
      const response = await apiRequest('POST', '/api/promo-codes/validate', {
        code: code.trim(),
        orderTotal,
        customerEmail
      });

      const data: PromoCodeValidationResponse = await response.json();

      if (data.valid) {
        setMessage({ type: 'success', text: data.message });
        onPromoApplied(code.trim().toUpperCase(), data.discount, data.promoCode?.id);
        setCode('');
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to validate promo code. Please try again.' });
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCode = () => {
    setCode('');
    setMessage(null);
    onPromoRemoved();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyCode();
    }
  };

  return (
    <div className="space-y-3">
      {!appliedPromoCode ? (
        <>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter promo code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              disabled={isValidating}
              className="flex-1"
            />
            <Button
              onClick={handleApplyCode}
              disabled={isValidating || !code.trim()}
              variant="outline"
              className="whitespace-nowrap"
            >
              {isValidating ? (
                <>
                  <FontAwesomeIcon icon="spinner" className="animate-spin mr-2" />
                  Applying...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon="tag" className="mr-2" />
                  Apply
                </>
              )}
            </Button>
          </div>

          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
              <AlertDescription className="text-sm">
                {message.type === 'success' && (
                  <FontAwesomeIcon icon="check-circle" className="mr-2 text-green-600" />
                )}
                {message.type === 'error' && (
                  <FontAwesomeIcon icon="exclamation-circle" className="mr-2" />
                )}
                {message.text}
              </AlertDescription>
            </Alert>
          )}
        </>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon="check-circle" className="text-green-600" />
              <div>
                <p className="text-sm font-semibold text-green-900">
                  Code "{appliedPromoCode}" applied
                </p>
                <p className="text-xs text-green-700">
                  You saved R{appliedDiscount?.toFixed(2)}
                </p>
              </div>
            </div>
            <Button
              onClick={handleRemoveCode}
              variant="ghost"
              size="sm"
              className="text-green-700 hover:text-green-900 hover:bg-green-100"
            >
              <FontAwesomeIcon icon="times" className="mr-1" />
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoCodeInput;

