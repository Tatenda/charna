import { useState, useEffect } from "react";
import Seo from "@/components/layout/Seo";
import { useLocation } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCart } from "@/hooks/useCart";
import CartSummary from "@/components/cart/CartSummary";
import YocoPayment from "@/components/payment/YocoPayment";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  province: z.string().min(2, { message: "Province is required" }),
  postalCode: z.string().min(4, { message: "Postal code is required" }),
  notes: z.string().optional(),
  embossingText: z.string().optional().refine(val => !val || val.length <= 30, {
    message: "Embossing text must be 30 characters or less"
  }),
  sameAsBilling: z.boolean().default(true),
  createAccount: z.boolean().default(false),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  }),
});

type CheckoutFormValues = z.infer<typeof formSchema>;

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CheckoutFormValues | null>(null);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      setLocation('/cart');
    }
  }, [cart, setLocation]);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      notes: "",
      embossingText: "",
      sameAsBilling: true,
      createAccount: false,
      acceptTerms: false,
    },
  });

  const shippingCost = cartTotal >= 1000 ? 0 : 150;
  const totalAmount = cartTotal + shippingCost;

  const onSubmit = async (values: CheckoutFormValues) => {
    if (!values.acceptTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive"
      });
      return;
    }

    // Store customer info and proceed to payment
    setCustomerInfo(values);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    if (!customerInfo) return;

    setIsSubmitting(true);
    
    try {
      // Create order with payment ID
      const response = await apiRequest("POST", "/api/orders", {
        customerInfo,
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        totalAmount: totalAmount,
        paymentId: paymentId,
        embossingText: customerInfo.embossingText || null
      });
      
      const order = await response.json();
      
      // Clear cart and redirect to success page
      clearCart();
      
      toast({
        title: "Order Completed Successfully!",
        description: `Your order #${order.id} has been confirmed and paid.`,
      });
      
      setLocation('/');
    } catch (error) {
      toast({
        title: "Order Creation Failed",
        description: "Payment successful but order creation failed. Please contact support.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive"
    });
    setShowPayment(false); // Allow user to try again
  };

  const handleBackToForm = () => {
    setShowPayment(false);
    setCustomerInfo(null);
  };

  return (
    <div className="bg-secondary-light">
      <Seo 
        title="Secure Checkout | Charna - Complete Your Leather Bag Purchase"
        description="Complete your purchase of premium handcrafted leather bags from Charna. Secure checkout with multiple payment options. Made in Johannesburg, South Africa."
        keywords="Charna checkout, secure payment, leather bag purchase, South African leather goods"
        url="/checkout"
        robots="noindex, nofollow"
      />
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-heading text-3xl md:text-4xl font-semibold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {!showPayment ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <h2 className="font-heading text-xl font-semibold">Contact Information</h2>
                    <Separator className="my-4" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="johndoe@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+27 12 345 6789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <h2 className="font-heading text-xl font-semibold pt-4">Shipping Information</h2>
                  <Separator className="my-4" />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main Street" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Cape Town" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Province</FormLabel>
                          <FormControl>
                            <Input placeholder="Western Cape" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="8001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Special instructions for delivery or additional information" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <FontAwesomeIcon icon="star" className="text-amber-600 mr-2" />
                      <h3 className="font-heading text-lg font-semibold text-amber-800">
                        Custom Embossing
                      </h3>
                    </div>
                    <p className="text-amber-700 text-sm mb-4">
                      Personalize your bag with custom embossing. Add your initials, name, or special message (up to 30 characters).
                    </p>
                    <FormField
                      control={form.control}
                      name="embossingText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Embossing Text (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., J.M.S., Sarah's Bag, or Adventure Awaits"
                              maxLength={30}
                              {...field}
                              data-testid="input-embossing-text"
                            />
                          </FormControl>
                          <div className="flex justify-between text-xs text-amber-600 mt-1">
                            <span>Leave blank for no embossing</span>
                            <span>{(field.value || "").length}/30 characters</span>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="sameAsBilling"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Billing address same as shipping</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="createAccount"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Create an account for future purchases</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="acceptTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I agree to the{" "}
                              <a href="/terms" className="text-primary hover:text-accent underline">
                                terms and conditions
                              </a>
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="btn-primary w-full" 
                    disabled={isSubmitting}
                    data-testid="button-proceed-payment"
                  >
                    {isSubmitting ? (
                      <>
                        <FontAwesomeIcon icon="spinner" className="animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon="arrow-right" className="mr-2" />
                        Proceed to Payment
                      </>
                    )}
                  </Button>
                  </form>
                </Form>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading text-xl font-semibold">Payment</h2>
                    <Button
                      variant="ghost"
                      onClick={handleBackToForm}
                      className="text-primary hover:text-accent"
                      data-testid="button-back-to-form"
                    >
                      <FontAwesomeIcon icon="arrow-left" className="mr-2" />
                      Back to Details
                    </Button>
                  </div>
                  <Separator className="my-4" />
                </div>
                
                <YocoPayment
                  amount={totalAmount}
                  customerInfo={customerInfo}
                  cartItems={cart}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  disabled={isSubmitting}
                />
              </div>
            )}
          </div>
          
          <div>
            <CartSummary showCheckoutButton={false} />
            
            {/* Secure Checkout */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <h3 className="font-accent text-sm uppercase tracking-wider font-semibold mb-3">We Accept</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <FontAwesomeIcon icon={['fab', 'cc-visa']} className="text-2xl text-blue-700" />
                <FontAwesomeIcon icon={['fab', 'cc-mastercard']} className="text-2xl text-red-600" />
                <FontAwesomeIcon icon={['fab', 'cc-amex']} className="text-2xl text-blue-500" />
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded border">
                    Powered by Yoco
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon icon="shield-alt" className="text-xl text-green-600 mr-3" />
                <h3 className="font-accent font-semibold">100% Secure Checkout</h3>
              </div>
              <p className="text-sm text-neutral-light">
                Your payment information is processed securely using Yoco's encrypted payment gateway. We do not store credit card details nor have access to your credit card information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
