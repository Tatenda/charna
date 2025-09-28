import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

    const response = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.YOCO_SECRET_KEY}`,
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
