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
            <h1 class="brand">Charna<span class="brand-dot">.</span></h1>
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

            <h3 style="color: #000;">What's Next?</h3>
            <p>🛠️ <strong>Crafting:</strong> Your order will be handcrafted within 3-5 business days.</p>
            <p>📦 <strong>Shipping:</strong> We'll send you tracking information once your order ships (usually within 2-5 business days after crafting).</p>
            <p>🎯 <strong>Delivery:</strong> Estimated delivery within ${shippingCost === 0 ? '2-3' : '3-5'} business days after shipping.</p>
        </div>

        <div class="footer">
            <div class="contact-info">
                <p><strong>Charna.</strong></p>
                <p>Email: info@charna.co.com | WhatsApp: +27 723560321</p>
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

WHAT'S NEXT?
Your order will be handcrafted within 3-5 business days. We'll send tracking information once it ships.

Charna.
info@charna.co.com | +27 723560321
    `;
  }
}