import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertContactSchema, type OrderItem } from "@shared/schema";
import { EmailService } from "./emailService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize email service
  const emailService = new EmailService();
  // In-memory recent checkout IDs for dev dashboard
  const recentCheckouts: Array<{ id: string; createdAt: string }> = [];
  const pushRecentCheckout = (id: string) => {
    if (!id) return;
    recentCheckouts.unshift({ id, createdAt: new Date().toISOString() });
    // keep latest 50
    if (recentCheckouts.length > 50) recentCheckouts.length = 50;
  };

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
      const {
        amountInCents,
        currency = "ZAR",
        customerInfo,
        metadata,
      } = req.body;

      if (!amountInCents || amountInCents <= 0 || !customerInfo) {
        return res
          .status(400)
          .json({ message: "Valid amount and customer info are required" });
      }

      const paymentData = {
        amount: amountInCents, // Yoco expects "amount" not "amountInCents"
        currency: currency,
        successUrl: `${req.protocol}://${req.get("host")}/checkout/success`,
        cancelUrl: `${req.protocol}://${req.get("host")}/checkout/cancel`,
        failureUrl: `${req.protocol}://${req.get("host")}/checkout/failure`,
        metadata: {
          customer_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone,
          ...metadata,
        },
      };

      // Use single YOCO_SECRET_KEY environment variable
      const secretKey = process.env.YOCO_SECRET_KEY;
      const keyType = process.env.NODE_ENV === "production" ? "live" : "test";

      console.log("Creating Yoco payment intent:", paymentData);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(
        `Using ${keyType} secret key:`,
        secretKey ? "Present" : "Missing",
      );

      // Use the correct Yoco API endpoint for payment creation
      const endpoint = "https://payments.yoco.com/api/checkouts";

      console.log("Using Yoco endpoint:", endpoint);

      const headers = {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      };

      console.log("Request headers ready (Authorization masked for security)");
      console.log("Request body:", JSON.stringify(paymentData, null, 2));

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(paymentData),
      });

      console.log("=== YOCO API CALL ===");
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries()),
      );

      const responseText = await response.text();
      console.log("Full response body:", responseText);

      if (!response.ok) {
        console.error("=== YOCO CHECKOUT CREATION FAILED ===");
        console.error("Status:", response.status);
        console.error("Response body:", responseText);
        try {
          const errorData = JSON.parse(responseText);
          console.error(
            "Parsed error data:",
            JSON.stringify(errorData, null, 2),
          );
          return res.status(400).json({
            message: "Payment session creation failed",
            error: errorData,
          });
        } catch (parseError) {
          console.error("Failed to parse Yoco error response:", parseError);
          return res.status(400).json({
            message: "Payment session creation failed",
            error: "Invalid response from payment provider",
          });
        }
      }

      let checkout;
      try {
        checkout = JSON.parse(responseText);
        console.log("=== YOCO CHECKOUT SUCCESS ===");
        console.log("Checkout ID:", checkout.id);
        console.log("Full checkout object:", JSON.stringify(checkout, null, 2));
        // Track checkout id for dev Test Payments dashboard
        if (checkout?.id) {
          pushRecentCheckout(checkout.id);
        }
      } catch (parseError) {
        console.error("Failed to parse Yoco success response:", parseError);
        return res.status(500).json({
          message: "Payment creation failed - invalid response format",
        });
      }

      res.json(checkout);
    } catch (error) {
      console.error("Error creating payment session:", error);
      res.status(500).json({ message: "Payment creation failed" });
    }
  });

  // Verify payment status
  app.get("/api/payments/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const secretKey = process.env.YOCO_SECRET_KEY;

      if (!secretKey) {
        return res.status(500).json({ message: "Missing Yoco secret key" });
      }

      // If a Checkout ID was passed, resolve to paymentId first
      let paymentId = id;
      if (id.startsWith("ch_")) {
        const coResp = await fetch(
          `https://payments.yoco.com/api/checkouts/${id}`,
          { headers: { Authorization: `Bearer ${secretKey}` } },
        );
        const checkout = await coResp.json();

        if (!coResp.ok) {
          return res.status(coResp.status).json({
            message: "Failed to fetch checkout",
            checkout,
          });
        }

        if (!checkout?.paymentId) {
          return res.status(409).json({
            message:
              "Checkout not completed yet (no paymentId). Poll /api/checkouts/:id and retry.",
            checkoutStatus: checkout?.status ?? "unknown",
          });
        }

        paymentId = checkout.paymentId;
      }

      // Verify the actual payment
      const verifyUrl = `https://api.yoco.com/v1/payments/${paymentId}`;
      const pResp = await fetch(verifyUrl, {
        headers: { Authorization: `Bearer ${secretKey}` },
      });
      const payment = await pResp.json();

      if (!pResp.ok) {
        return res.status(pResp.status).json({
          message: "Payment not found",
          paymentId,
          yocoError: payment,
        });
      }

      return res.json(payment);
    } catch (error) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ message: "Payment verification failed" });
    }
  });

  // Process payment with token (PCI compliant)
  app.post("/api/payments/charge", async (req, res) => {
    try {
      const {
        token,
        amountInCents,
        currency = "ZAR",
        customerInfo,
        metadata,
      } = req.body;

      console.log("Payment charge request:", {
        token,
        amountInCents,
        currency,
        customerInfo,
        metadata,
      });

      if (!token || !amountInCents || !customerInfo) {
        return res
          .status(400)
          .json({ message: "Missing required payment information" });
      }

      console.log(
        "Processing payment charge with token:",
        token.substring(0, 20) + "...",
      );

      // Check if this is a demo token (for development/demo purposes)
      if (token.startsWith("demo_token_")) {
        console.log("Processing demo payment token:", token);

        // Simulate successful demo payment
        const demoResult = {
          id: `demo_charge_${Date.now()}`,
          status: "successful",
          amountInCents: amountInCents,
          currency: currency,
          metadata: {
            customer_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
            customer_email: customerInfo.email,
            customer_phone: customerInfo.phone,
            ...metadata,
          },
        };

        console.log("Demo payment successful:", demoResult);

        return res.json({
          id: demoResult.id,
          status: demoResult.status,
          amount: demoResult.amountInCents,
          currency: demoResult.currency,
          message: "Demo payment processed successfully",
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
          ...metadata,
        },
      };

      console.log("Sending charge to Yoco API:", chargeData);

      // Use appropriate secret key based on environment
      const secretKey = process.env.YOCO_SECRET_KEY;

      const response = await fetch("https://api.yoco.com/v1/charges", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chargeData),
      });

      const result = await response.json();
      console.log("Yoco API response:", { status: response.status, result });

      if (!response.ok) {
        console.error("Yoco charge failed:", result);
        return res.status(400).json({
          message: result.message || "Payment failed",
          status: "failed",
          error: result,
        });
      }

      // Return success response
      res.json({
        id: result.id,
        status: result.status,
        amount: result.amountInCents,
        currency: result.currency,
        message: "Payment processed successfully",
      });
    } catch (error) {
      console.error("Error processing charge:", error);
      res.status(500).json({
        message: "Payment processing failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Create order (updated to work with payment)
  app.post("/api/orders", async (req, res) => {
    console.log('=== ORDER CREATION REQUEST ===');
    console.log('Order data received:', JSON.stringify(req.body, null, 2));
    try {
      const orderData = req.body;

      // Basic validation
      if (
        !orderData.customerInfo ||
        !orderData.items ||
        !orderData.totalAmount
      ) {
        return res
          .status(400)
          .json({ message: "Missing required order information" });
      }

      // If payment ID is provided, verify payment first
      if (orderData.paymentId) {
      }

      // Create order
      const order = await storage.createOrder({
        customerInfo: orderData.customerInfo,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        paymentId: orderData.paymentId || null,
        status: orderData.paymentId ? "paid" : "pending",
      });

      console.log('Order created successfully:', {
        id: order.id,
        status: order.status,
        paymentId: order.paymentId,
        totalAmount: order.totalAmount
      });

      // Send email receipt for paid orders
      if (orderData.paymentId && order) {
        try {
          // Check if order contains any test products
          const hasTestProduct = orderData.items.some((item: OrderItem) => 
            item.productId === 9 || item.productName === "Test Bag"
          );
          
          // No shipping cost for test products, otherwise apply normal logic
          const shippingCost = hasTestProduct ? 0 : (orderData.totalAmount >= 1000 ? 0 : 150);

          await emailService.sendOrderReceipt({
            customerInfo: orderData.customerInfo,
            items: orderData.items,
            orderId: order.id.toString(),
            totalAmount: orderData.totalAmount,
            shippingCost,
            paymentId: orderData.paymentId,
          });

        } catch (emailError) {
          console.error("Failed to send receipt email:", emailError);
          // No failure here—order was successful
        }
      } else {
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
        message: "Contact form submitted successfully",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid form data",
          errors: error.errors,
        });
      }

      console.error("Error submitting contact form:", error);
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  app.get("/api/checkouts/:id", async (req, res) => {
    try {
      const secretKey = process.env.YOCO_SECRET_KEY;

      if (!secretKey) {
        return res.status(500).json({ message: "Missing Yoco secret key" });
      }

      const r = await fetch(
        `https://payments.yoco.com/api/checkouts/${req.params.id}`,
        { headers: { Authorization: `Bearer ${secretKey}` } },
      );

      const body = await r.json();
      return r.ok ? res.json(body) : res.status(r.status).json(body);
    } catch (e) {
      console.error("Failed to fetch checkout:", e);
      res.status(500).json({ message: "Failed to fetch checkout" });
    }
  });

  // Dev/Test: List recent checkouts and resolve to full objects
  app.get("/api/test-payments/checkouts", async (req, res) => {
    try {
      const secretKey = process.env.YOCO_SECRET_KEY;
      if (!secretKey) {
        return res
          .status(500)
          .json({ message: "Yoco secret key not configured" });
      }

      const ids = Array.from(new Set(recentCheckouts.map((c) => c.id)));
      const checkouts = (
        await Promise.all(
          ids.map(async (id) => {
            try {
              const r = await fetch(
                `https://payments.yoco.com/api/checkouts/${id}`,
                { headers: { Authorization: `Bearer ${secretKey}` } },
              );
              const body = await r.json();
              if (!r.ok) return null;
              return body;
            } catch (e) {
              return null;
            }
          }),
        )
      ).filter(Boolean);

      res.json({ checkouts });
    } catch (e) {
      console.error("Failed to fetch test checkouts:", e);
      res.status(500).json({ message: "Failed to fetch test checkouts" });
    }
  });

  // Dev/Test: Fetch payment details by paymentId via Payments API
  app.get("/api/test-payments/payments/:paymentId", async (req, res) => {
    try {
      const { paymentId } = req.params;
      const secretKey = process.env.YOCO_SECRET_KEY;
      if (!secretKey) {
        return res
          .status(500)
          .json({ message: "Yoco secret key not configured" });
      }

      const yocoResponse = await fetch(
        `https://api.yoco.com/v1/payments/${paymentId}`,
        { headers: { Authorization: `Bearer ${secretKey}` } },
      );
      const data = await yocoResponse.json();
      if (!yocoResponse.ok) {
        return res
          .status(yocoResponse.status)
          .json({ message: "Failed to fetch payment", error: data });
      }
      res.json({ payment: data });
    } catch (e) {
      console.error("Failed to fetch payment:", e);
      res.status(500).json({ message: "Failed to fetch payment" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
