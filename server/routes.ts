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

  // Create payment with Yoco
  app.post("/api/payments/create", async (req, res) => {
    try {
      const { amount, currency = 'ZAR', metadata } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Valid amount is required" });
      }

      const response = await fetch('https://online.yoco.com/v1/charges', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.YOCO_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency,
          metadata: metadata || {}
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Yoco payment creation failed:', errorData);
        return res.status(400).json({ message: 'Payment creation failed', error: errorData });
      }

      const payment = await response.json();
      res.json({ 
        paymentId: payment.id,
        status: payment.status,
        amount: payment.amount
      });
    } catch (error) {
      console.error('Error creating Yoco payment:', error);
      res.status(500).json({ message: 'Payment creation failed' });
    }
  });

  // Verify payment status
  app.get("/api/payments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const response = await fetch(`https://online.yoco.com/v1/charges/${id}`, {
        headers: {
          'Authorization': `Bearer ${process.env.YOCO_SECRET_KEY}`
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
      const { token, amount, currency = 'ZAR', customerInfo, metadata } = req.body;
      
      console.log('Payment charge request:', { token, amount, currency, customerInfo, metadata });
      
      if (!token || !amount || !customerInfo) {
        return res.status(400).json({ message: 'Missing required payment information' });
      }

      // Check if this is a demo token (for development/demo purposes)
      if (token.startsWith('demo_token_')) {
        console.log('Processing demo payment token:', token);
        
        // Simulate successful demo payment
        const demoResult = {
          id: `demo_charge_${Date.now()}`,
          status: 'successful',
          amountInCents: Math.round(amount * 100),
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
        amountInCents: Math.round(amount * 100),
        currency,
        metadata: {
          customer_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone,
          ...metadata
        }
      };

      console.log('Sending charge to Yoco API:', chargeData);

      const response = await fetch('https://online.yoco.com/v1/charges', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.YOCO_SECRET_KEY}`,
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
          const paymentResponse = await fetch(`https://online.yoco.com/v1/charges/${orderData.paymentId}`, {
            headers: {
              'Authorization': `Bearer ${process.env.YOCO_SECRET_KEY}`
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
          
          // Verify amount matches
          const expectedAmount = Math.round(orderData.totalAmount * 100);
          if (payment.amount !== expectedAmount) {
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
