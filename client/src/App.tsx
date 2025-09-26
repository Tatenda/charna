import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import CheckoutSuccess from "@/pages/CheckoutSuccess";
import CheckoutCancel from "@/pages/CheckoutCancel";
import CheckoutFailure from "@/pages/CheckoutFailure";
import TestPayments from "@/pages/TestPayments";
import Story from "@/pages/Story";
import Contact from "@/pages/Contact";
import ShippingReturns from "@/pages/ShippingReturns";
import FAQ from "@/pages/FAQ";
import Care from "@/pages/Care";
import Browse from "@/pages/Browse";
import ProductDetail from "@/pages/ProductDetail";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { CartProvider } from "@/hooks/useCart";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/checkout/success" component={CheckoutSuccess} />
      <Route path="/checkout/cancel" component={CheckoutCancel} />
      <Route path="/checkout/failure" component={CheckoutFailure} />
      <Route path="/test-payments" component={TestPayments} />
      <Route path="/story" component={Story} />
      <Route path="/contact" component={Contact} />
      <Route path="/shipping-returns" component={ShippingReturns} />
      <Route path="/faq" component={FAQ} />
      <Route path="/care" component={Care} />
      <Route path="/browse" component={Browse} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-16">
              <Router />
            </main>
            <WhatsAppButton />
            <Footer />
          </div>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
