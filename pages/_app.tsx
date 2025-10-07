import type { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react";
import router, { useRouter } from "next/router";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { CartProvider } from "@/hooks/useCart";
import "@/styles/globals.css";

// FontAwesome configuration - disable SSR to prevent hydration issues
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

// Tell Font Awesome to skip adding the CSS automatically since it's already imported above
config.autoAddCss = false;

function AppContent({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith('/admin');

  if (isAdminPage) {
    // For admin pages, render without main site header/footer
    return <Component {...pageProps} />;
  }

  // For regular pages, render with main site layout
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16">
        <Component {...pageProps} />
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
}

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
            <TooltipProvider>
              <Toaster />
              <AppContent Component={Component} pageProps={pageProps} router={router} />
            </TooltipProvider>
        </CartProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp;
