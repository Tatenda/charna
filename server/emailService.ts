import nodemailer from 'nodemailer';

interface OrderEmailData {
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    billingAddress?: string;
    billingCity?: string;
    billingProvince?: string;
    billingPostalCode?: string;
    sameAsBilling?: boolean;
  };
  items: Array<{
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    customizations?: {
      embossing?: boolean;
      embossingText?: string;
      embossingPrice?: number;
      color?: string;
      bagColor?: string;
      sleeveColor?: string;
    };
  }>;
  orderId: string;
  subtotal?: number;
  discountAmount?: number;
  totalAmount: number;
  shippingCost: number;
  promoCodeUsed?: string;
  paymentId: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Gmail SMTP configuration
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.GMAIL_USER, // Your business email
        pass: process.env.GMAIL_APP_PASSWORD, // Gmail app password
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendOrderReceipt(orderData: OrderEmailData): Promise<boolean> {
    try {
      const emailHtml = this.generateReceiptHTML(orderData);
      const emailText = this.generateReceiptText(orderData);

      const mailOptions = {
        from: `"Charna." <${process.env.GMAIL_USER}>`,
        to: orderData.customerInfo.email,
        subject: `Order Confirmation #${orderData.orderId} - Thank You for Your Purchase!`,
        text: emailText,
        html: emailHtml,
      };

      console.log('Sending email receipt to:', orderData.customerInfo.email);
      await this.transporter.sendMail(mailOptions);
      console.log('Email receipt sent successfully');
      return true;
    } catch (error) {
      console.error('Failed to send receipt email:', error);
      return false;
    }
  }

  private generateReceiptHTML(orderData: OrderEmailData): string {
    const { customerInfo, items, orderId, totalAmount, shippingCost, paymentId } = orderData;
    const subtotal = totalAmount - shippingCost;
    
    // Use production URL for links
    const baseUrl = process.env.NEXT_PUBLIC_URL || 
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') || 
                    'https://www.charna.co.com';
    
    // Embed logo as base64 for email compatibility
    const logoBase64 = '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';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Receipt - Charna</title>
    <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 0; }
        .header { background: #B67E5A; color: white; padding: 30px; text-align: center; }
        .brand { font-size: 32px; font-weight: bold; margin: 0; }
        .brand-dot { color: #D4A574; font-size: 48px; }
        .content { padding: 30px; }
        .order-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .item-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .item-table th, .item-table td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
        .item-table th { background: #f8f9fa; font-weight: bold; }
        .total-section { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .total-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .total-final { font-weight: bold; font-size: 18px; border-top: 2px solid #000; padding-top: 10px; }
        .embossing-detail { background: #fff3cd; padding: 8px; border-radius: 4px; margin: 4px 0; font-style: italic; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
        .contact-info { margin: 15px 0; }
        @media (max-width: 600px) {
            .container { margin: 0; }
            .content { padding: 15px; }
            .item-table { font-size: 14px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="brand"><a href="${baseUrl}" style="color: white; text-decoration: none;">Charna<span class="brand-dot">.</span></a></h1>
            <p style="margin: 10px 0 0; font-size: 16px;">Premium Handcrafted Leather Goods</p>
        </div>
        
        <div class="content">
            <h2 style="color: #B67E5A; margin-bottom: 10px;">Thank You for Your Order!</h2>
            <p>Hi ${customerInfo.firstName},</p>
            <p>Your order has been confirmed and payment has been successfully processed. We're excited to craft your premium leather goods.</p>
            
            <div class="order-info">
                <h3 style="margin-top: 0; color: #000;">Order Details</h3>
                <p><strong>Order Number:</strong> #${orderId}</p>
                <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-ZA', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}</p>
            </div>

            <h3 style="color: #000;">Items Ordered</h3>
            <table class="item-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(item => {
                      const basePrice = item.price;
                      const embossingPrice = item.customizations?.embossingPrice || 0;
                      const unitPrice = basePrice + embossingPrice;
                      const itemTotal = unitPrice * item.quantity;
                      return `
                        <tr>
                            <td>
                                <strong>${item.productName}</strong>
                                ${item.customizations?.color ? `<br><small>Color: ${item.customizations.color}</small>` : ''}
                                ${item.customizations?.bagColor ? `<br><small>Bag: ${item.customizations.bagColor}</small>` : ''}
                                ${item.customizations?.sleeveColor ? `<br><small>Sleeve: ${item.customizations.sleeveColor}</small>` : ''}
                                ${item.customizations?.embossing && item.customizations?.embossingText ? 
                                  `<div class="embossing-detail" style="background: #FEF3C7; padding: 6px 8px; border-radius: 4px; border-left: 3px solid #F59E0B; margin-top: 4px;">
                                    <strong style="color: #92400E;">✨ Custom Embossing:</strong> "${item.customizations.embossingText}"
                                  </div>` : ''}
                            </td>
                            <td>${item.quantity}</td>
                            <td>
                                ${embossingPrice > 0 ? 
                                  `R${basePrice.toLocaleString()}<br><small style="color: #92400E; font-weight: 600;">+ R${embossingPrice} embossing</small>` : 
                                  `R${basePrice.toLocaleString()}`
                                }
                            </td>
                            <td>R${itemTotal.toLocaleString()}</td>
                        </tr>
                      `;
                    }).join('')}
                </tbody>
            </table>

            <div class="total-section">
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span>R${(orderData.subtotal || subtotal).toLocaleString()}</span>
                </div>
                ${orderData.discountAmount && orderData.discountAmount > 0 ? `
                <div class="total-row" style="color: #15803D;">
                    <span>${orderData.promoCodeUsed ? `Discount (${orderData.promoCodeUsed}):` : 'Discount:'}</span>
                    <span>-R${orderData.discountAmount.toLocaleString()}</span>
                </div>
                ` : ''}
                <div class="total-row">
                    <span>Shipping:</span>
                    <span>${shippingCost === 0 ? 'Free' : `R${shippingCost.toLocaleString()}`}</span>
                </div>
                <div class="total-row total-final">
                    <span>Total Paid:</span>
                    <span>R${totalAmount.toLocaleString()}</span>
                </div>
            </div>

            <h3 style="color: #000;">Shipping Address</h3>
            <div class="order-info">
                <p>${customerInfo.firstName} ${customerInfo.lastName}<br>
                ${customerInfo.address}<br>
                ${customerInfo.city}, ${customerInfo.province} ${customerInfo.postalCode}<br>
                Phone: ${customerInfo.phone}</p>
            </div>

            ${!customerInfo.sameAsBilling && customerInfo.billingAddress ? `
            <h3 style="color: #000; margin-top: 20px;">Billing Address</h3>
            <div class="order-info">
                <p>${customerInfo.firstName} ${customerInfo.lastName}<br>
                ${customerInfo.billingAddress}<br>
                ${customerInfo.billingCity}, ${customerInfo.billingProvince} ${customerInfo.billingPostalCode}</p>
            </div>
            ` : ''}

            <h3 style="color: #000;">What's Next?</h3>
            <p>🛠️ <strong>Crafting:</strong> Your order will be handcrafted within 3-5 business days.</p>
            <p>📦 <strong>Shipping:</strong> We'll send you tracking information once your order ships (usually within 2-5 business days after crafting).</p>
            <p>🎯 <strong>Delivery:</strong> Estimated delivery within ${shippingCost === 0 ? '2-3' : '3-5'} business days after shipping.</p>
        </div>

        <div class="footer">
            <div class="contact-info">
                <p><strong><a href="${baseUrl}" style="color: #333; text-decoration: none;">Charna.</a></strong></p>
                <p>Email: <a href="mailto:info@charna.co.com" style="color: #666; text-decoration: none;">info@charna.co.com</a> | WhatsApp: <a href="https://wa.me/27723560321" style="color: #666; text-decoration: none;">+27 723560321</a></p>
                <p><a href="${baseUrl}" style="color: #666; text-decoration: none;">www.charna.co.com</a></p>
            </div>
            <p style="font-size: 12px; color: #999; margin-top: 20px;">
                This is an automated receipt. Please save this email for your records.
            </p>
        </div>
    </div>
</body>
</html>
    `;
  }

  private generateReceiptText(orderData: OrderEmailData): string {
    const { customerInfo, items, orderId, totalAmount, shippingCost, paymentId } = orderData;
    const subtotal = totalAmount - shippingCost;

    return `
CHARNA.
Order Confirmation #${orderId}

Hi ${customerInfo.firstName},

Thank you for your order! Your payment has been successfully processed.

ORDER DETAILS:
- Order Number: #${orderId}
- Order Date: ${new Date().toLocaleDateString('en-ZA')}

ITEMS ORDERED:
${items.map(item => {
  const basePrice = item.price;
  const embossingPrice = item.customizations?.embossingPrice || 0;
  const unitPrice = basePrice + embossingPrice;
  const itemTotal = unitPrice * item.quantity;
  
  let itemText = `- ${item.productName} (Qty: ${item.quantity})`;
  if (embossingPrice > 0) {
    itemText += `\n  Base Price: R${basePrice.toLocaleString()} + R${embossingPrice} embossing = R${unitPrice.toLocaleString()}`;
    itemText += `\n  Total: R${itemTotal.toLocaleString()}`;
  } else {
    itemText += ` - R${itemTotal.toLocaleString()}`;
  }
  
  if (item.customizations?.color) itemText += `\n  Color: ${item.customizations.color}`;
  if (item.customizations?.bagColor) itemText += `\n  Bag Color: ${item.customizations.bagColor}`;
  if (item.customizations?.sleeveColor) itemText += `\n  Sleeve Color: ${item.customizations.sleeveColor}`;
  if (item.customizations?.embossing && item.customizations?.embossingText) {
    itemText += `\n  ✨ Custom Embossing: "${item.customizations.embossingText}"`;
  }
  
  return itemText;
}).join('\n\n')}

TOTAL BREAKDOWN:
Subtotal: R${(orderData.subtotal || subtotal).toLocaleString()}
${orderData.discountAmount && orderData.discountAmount > 0 ? 
  `${orderData.promoCodeUsed ? `Discount (${orderData.promoCodeUsed})` : 'Discount'}: -R${orderData.discountAmount.toLocaleString()}\n` : 
  ''}Shipping: ${shippingCost === 0 ? 'Free' : `R${shippingCost.toLocaleString()}`}
Total Paid: R${totalAmount.toLocaleString()}

SHIPPING ADDRESS:
${customerInfo.firstName} ${customerInfo.lastName}
${customerInfo.address}
${customerInfo.city}, ${customerInfo.province} ${customerInfo.postalCode}
Phone: ${customerInfo.phone}

${!customerInfo.sameAsBilling && customerInfo.billingAddress ? `
BILLING ADDRESS:
${customerInfo.firstName} ${customerInfo.lastName}
${customerInfo.billingAddress}
${customerInfo.billingCity}, ${customerInfo.billingProvince} ${customerInfo.billingPostalCode}
` : ''}

WHAT'S NEXT?
Your order will be handcrafted within 3-5 business days. We'll send tracking information once it ships.

Charna.
info@charna.co.com | +27 723560321
    `;
  }
}