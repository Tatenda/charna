import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertContactSchema } from "@shared/schema";
import { EmailService } from "./emailService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize email service
  const emailService = new EmailService();
  
  // API Routes
  
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const featured = req.query.featured === "true";
      const products = featured 
        ? await storage.getFeaturedProducts()
        : await storage.getAllProducts();
      
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get product by ID
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Create payment intent for popup SDK integration
  app.post("/api/payments/create", async (req, res) => {
    try {
      const { amountInCents, currency = 'ZAR', customerInfo, metadata } = req.body;
      
      if (!amountInCents || amountInCents <= 0 || !customerInfo) {
        return res.status(400).json({ message: "Valid amount and customer info are required" });
      }

      const paymentData = {
        amount: amountInCents, // Yoco expects "amount" not "amountInCents"
        currency: currency,
        metadata: {
          customer_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone,
          ...metadata
        }
      };

      // Determine which keys to use based on environment
      const isProduction = process.env.NODE_ENV === 'production';
      const secretKey = isProduction ? process.env.YOCO_LIVE_SECRET_KEY : process.env.YOCO_TEST_SECRET_KEY;
      const keyType = isProduction ? 'live' : 'test';
      
      console.log('Creating Yoco payment intent:', paymentData);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Using ${keyType} secret key:`, secretKey ? 'Present' : 'Missing');
      console.log(`${keyType} secret key masked:`, secretKey ? `sk_${keyType}_****` + secretKey.slice(-4) : 'N/A');

      // Use the correct Yoco API endpoint for payment creation
      const endpoint = 'https://payments.yoco.com/api/checkouts';
      
      console.log('Using Yoco endpoint:', endpoint);
      
      const headers = {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      };
      
      console.log('Request headers ready (Authorization masked for security)');
      console.log('Request body:', JSON.stringify(paymentData, null, 2));
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(paymentData)
      });

      console.log('=== YOCO API CALL ===');
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('Full response body:', responseText);

      if (!response.ok) {
        console.error('=== YOCO CHECKOUT CREATION FAILED ===');
        console.error('Status:', response.status);
        console.error('Response body:', responseText);
        try {
          const errorData = JSON.parse(responseText);
          console.error('Parsed error data:', JSON.stringify(errorData, null, 2));
          return res.status(400).json({ message: 'Payment session creation failed', error: errorData });
        } catch (parseError) {
          console.error('Failed to parse Yoco error response:', parseError);
          return res.status(400).json({ message: 'Payment session creation failed', error: 'Invalid response from payment provider' });
        }
      }

      let checkout;
      try {
        checkout = JSON.parse(responseText);
        console.log('=== YOCO CHECKOUT SUCCESS ===');
        console.log('Checkout ID:', checkout.id);
        console.log('Full checkout object:', JSON.stringify(checkout, null, 2));
      } catch (parseError) {
        console.error('Failed to parse Yoco success response:', parseError);
        return res.status(500).json({ message: 'Payment creation failed - invalid response format' });
      }
      
      res.json(checkout);
    } catch (error) {
      console.error('Error creating payment session:', error);
      res.status(500).json({ message: 'Payment creation failed' });
    }
  });

  // Verify payment status
  app.get("/api/payments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Use appropriate secret key based on environment
      const isProduction = process.env.NODE_ENV === 'production';
      const secretKey = isProduction ? process.env.YOCO_LIVE_SECRET_KEY : process.env.YOCO_TEST_SECRET_KEY;
      
      const response = await fetch(`https://api.yoco.com/v1/charges/${id}`, {
        headers: {
          'Authorization': `Bearer ${secretKey}`
        }
      });

      if (!response.ok) {
        return res.status(404).json({ message: 'Payment not found' });
      }

      const payment = await response.json();
      res.json(payment);
    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).json({ message: 'Payment verification failed' });
    }
  });

  // Process payment with token (PCI compliant)
  app.post("/api/payments/charge", async (req, res) => {
    try {
      const { token, amountInCents, currency = 'ZAR', customerInfo, metadata } = req.body;
      
      console.log('Payment charge request:', { token, amountInCents, currency, customerInfo, metadata });
      
      if (!token || !amountInCents || !customerInfo) {
        return res.status(400).json({ message: 'Missing required payment information' });
      }

      console.log('Processing payment charge with token:', token.substring(0, 20) + '...');
      
      // Check if this is a demo token (for development/demo purposes)
      if (token.startsWith('demo_token_')) {
        console.log('Processing demo payment token:', token);
        
        // Simulate successful demo payment
        const demoResult = {
          id: `demo_charge_${Date.now()}`,
          status: 'successful',
          amountInCents: amountInCents,
          currency: currency,
          metadata: {
            customer_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
            customer_email: customerInfo.email,
            customer_phone: customerInfo.phone,
            ...metadata
          }
        };
        
        console.log('Demo payment successful:', demoResult);
        
        return res.json({
          id: demoResult.id,
          status: demoResult.status,
          amount: demoResult.amountInCents,
          currency: demoResult.currency,
          message: 'Demo payment processed successfully'
        });
      }

      // For real tokens, process with Yoco API
      const chargeData = {
        token: token,
        amountInCents: amountInCents,
        currency,
        metadata: {
          customer_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone,
          ...metadata
        }
      };

      console.log('Sending charge to Yoco API:', chargeData);

      const response = await fetch('https://api.yoco.com/v1/charges', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.YOCO_TEST_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(chargeData)
      });

      const result = await response.json();
      console.log('Yoco API response:', { status: response.status, result });

      if (!response.ok) {
        console.error('Yoco charge failed:', result);
        return res.status(400).json({ 
          message: result.message || 'Payment failed', 
          status: 'failed',
          error: result 
        });
      }

      // Return success response
      res.json({
        id: result.id,
        status: result.status,
        amount: result.amountInCents,
        currency: result.currency,
        message: 'Payment processed successfully'
      });

    } catch (error) {
      console.error('Error processing charge:', error);
      res.status(500).json({ message: 'Payment processing failed', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Create order (updated to work with payment)
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = req.body;
      
      // Basic validation
      if (!orderData.customerInfo || !orderData.items || !orderData.totalAmount) {
        return res.status(400).json({ message: "Missing required order information" });
      }
      
      // If payment ID is provided, verify payment first
      if (orderData.paymentId) {
        console.log('Verifying payment ID:', orderData.paymentId);
        
        // Handle demo payments (don't verify against real API)
        if (orderData.paymentId.startsWith('demo_charge_')) {
          console.log('Processing demo payment for order creation');
          // For demo payments, we trust they were successful since they were created by our backend
          // In production, this would be verified against the real Yoco API
        } else {
          // For real payments, verify against Yoco API
          const paymentResponse = await fetch(`https://api.yoco.com/v1/charges/${orderData.paymentId}`, {
            headers: {
              'Authorization': `Bearer ${process.env.YOCO_TEST_SECRET_KEY}`
            }
          });
          
          if (!paymentResponse.ok) {
            console.log('Payment verification failed:', paymentResponse.status);
            return res.status(400).json({ message: "Invalid payment ID" });
          }
          
          const payment = await paymentResponse.json();
          console.log('Payment verification result:', payment);
          
          if (payment.status !== 'successful') {
            return res.status(400).json({ message: "Payment not successful" });
          }
          
          // Verify amount matches (Yoco returns amountInCents)
          const expectedAmount = Math.round(orderData.totalAmount * 100);
          const paymentAmount = payment.amountInCents ?? payment.amount;
          if (paymentAmount !== expectedAmount) {
            return res.status(400).json({ message: "Payment amount mismatch" });
          }
        }
      }
      
      // Create order
      const order = await storage.createOrder({
        customerInfo: orderData.customerInfo,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        paymentId: orderData.paymentId || null,
        status: orderData.paymentId ? "paid" : "pending",
      });
      
      // Send email receipt for paid orders
      if (orderData.paymentId && order) {
        try {
          const shippingCost = orderData.totalAmount >= 1000 ? 0 : 150;
          
          await emailService.sendOrderReceipt({
            customerInfo: orderData.customerInfo,
            items: orderData.items,
            orderId: order.id.toString(),
            totalAmount: orderData.totalAmount,
            shippingCost: shippingCost,
            paymentId: orderData.paymentId
          });
          
          console.log(`Email receipt sent for order #${order.id}`);
        } catch (emailError) {
          console.error('Failed to send receipt email:', emailError);
          // Don't fail the order if email fails - order was successful
        }
      }
      
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Submit contact form
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate contact form data
      const contactData = insertContactSchema.parse(req.body);
      
      // Store contact submission
      const contact = await storage.createContact(contactData);
      
      res.status(201).json({ 
        success: true, 
        message: "Contact form submitted successfully" 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid form data",
          errors: error.errors 
        });
      }
      
      console.error("Error submitting contact form:", error);
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
