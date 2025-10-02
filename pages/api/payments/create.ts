import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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
      currency,
      successUrl: `${req.headers.origin}/checkout/success`,
      cancelUrl: `${req.headers.origin}/checkout`,
      failureUrl: `${req.headers.origin}/checkout`,
      metadata: {
        customerEmail: customerInfo.email,
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        ...metadata,
      },
    };

    // Determine which keys to use based on environment
    const isProduction = process.env.NODE_ENV === "production";
    const secretKey = isProduction
      ? process.env.YOCO_LIVE_SECRET_KEY
      : process.env.YOCO_TEST_SECRET_KEY;
    
    if (!secretKey) {
      return res.status(500).json({ message: 'Missing Yoco secret key' });
    }

    const response = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Yoco API error:", errorData);
      return res.status(response.status).json({
        message: "Failed to create payment session",
        error: errorData,
      });
    }

    const checkoutData = await response.json();
    return res.status(200).json(checkoutData);
  } catch (error) {
    console.error("Error creating payment:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
