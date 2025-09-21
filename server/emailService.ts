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
  totalAmount: number;
  shippingCost: number;
  paymentId: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Gmail SMTP configuration
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Your business email
        pass: process.env.GMAIL_APP_PASSWORD, // Gmail app password
      },
    });
  }

  async sendOrderReceipt(orderData: OrderEmailData): Promise<boolean> {
    try {
      const emailHtml = this.generateReceiptHTML(orderData);
      const emailText = this.generateReceiptText(orderData);

      const mailOptions = {
        from: `"Charna Leather Goods" <${process.env.GMAIL_USER}>`,
        to: orderData.customerInfo.email,
        subject: `Order Confirmation #${orderData.orderId} - Thank You for Your Purchase!`,
        text: emailText,
        html: emailHtml,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Receipt email sent successfully to ${orderData.customerInfo.email}`);
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
        .header { background: #000; color: white; padding: 30px; text-align: center; }
        .brand { font-size: 32px; font-weight: bold; margin: 0; }
        .brand-dot { color: #8B4513; font-size: 48px; }
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
            <h2 style="color: #8B4513; margin-bottom: 10px;">Thank You for Your Order!</h2>
            <p>Hi ${customerInfo.firstName},</p>
            <p>Your order has been confirmed and payment has been successfully processed. We're excited to craft your premium leather goods in our Johannesburg workshop.</p>
            
            <div class="order-info">
                <h3 style="margin-top: 0; color: #000;">Order Details</h3>
                <p><strong>Order Number:</strong> #${orderId}</p>
                <p><strong>Payment ID:</strong> ${paymentId}</p>
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
                      const itemTotal = (item.price + (item.customizations?.embossingPrice || 0)) * item.quantity;
                      return `
                        <tr>
                            <td>
                                <strong>${item.productName}</strong>
                                ${item.customizations?.color ? `<br><small>Color: ${item.customizations.color}</small>` : ''}
                                ${item.customizations?.bagColor ? `<br><small>Bag: ${item.customizations.bagColor}</small>` : ''}
                                ${item.customizations?.sleeveColor ? `<br><small>Sleeve: ${item.customizations.sleeveColor}</small>` : ''}
                                ${item.customizations?.embossing && item.customizations?.embossingText ? 
                                  `<div class="embossing-detail">+ Custom Embossing: "${item.customizations.embossingText}"</div>` : ''}
                            </td>
                            <td>${item.quantity}</td>
                            <td>R${(item.price + (item.customizations?.embossingPrice || 0)).toLocaleString()}</td>
                            <td>R${itemTotal.toLocaleString()}</td>
                        </tr>
                      `;
                    }).join('')}
                </tbody>
            </table>

            <div class="total-section">
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span>R${subtotal.toLocaleString()}</span>
                </div>
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
            <p>🛠️ <strong>Crafting:</strong> Your order will be handcrafted in our Johannesburg workshop within 3-5 business days.</p>
            <p>📦 <strong>Shipping:</strong> We'll send you tracking information once your order ships (usually within 2-5 business days after crafting).</p>
            <p>🎯 <strong>Delivery:</strong> Estimated delivery within ${shippingCost === 0 ? '2-3' : '3-5'} business days after shipping.</p>
        </div>

        <div class="footer">
            <div class="contact-info">
                <p><strong>Charna Leather Goods</strong></p>
                <p>Johannesburg, South Africa</p>
                <p>Email: hello@charna.co.za | WhatsApp: +27 12 345 6789</p>
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
CHARNA LEATHER GOODS
Order Confirmation #${orderId}

Hi ${customerInfo.firstName},

Thank you for your order! Your payment has been successfully processed.

ORDER DETAILS:
- Order Number: #${orderId}
- Payment ID: ${paymentId}
- Order Date: ${new Date().toLocaleDateString('en-ZA')}

ITEMS ORDERED:
${items.map(item => {
  const itemTotal = (item.price + (item.customizations?.embossingPrice || 0)) * item.quantity;
  let itemText = `- ${item.productName} (Qty: ${item.quantity}) - R${itemTotal.toLocaleString()}`;
  
  if (item.customizations?.color) itemText += `\n  Color: ${item.customizations.color}`;
  if (item.customizations?.bagColor) itemText += `\n  Bag Color: ${item.customizations.bagColor}`;
  if (item.customizations?.sleeveColor) itemText += `\n  Sleeve Color: ${item.customizations.sleeveColor}`;
  if (item.customizations?.embossing && item.customizations?.embossingText) {
    itemText += `\n  + Custom Embossing: "${item.customizations.embossingText}"`;
  }
  
  return itemText;
}).join('\n')}

TOTAL BREAKDOWN:
Subtotal: R${subtotal.toLocaleString()}
Shipping: ${shippingCost === 0 ? 'Free' : `R${shippingCost.toLocaleString()}`}
Total Paid: R${totalAmount.toLocaleString()}

SHIPPING ADDRESS:
${customerInfo.firstName} ${customerInfo.lastName}
${customerInfo.address}
${customerInfo.city}, ${customerInfo.province} ${customerInfo.postalCode}
Phone: ${customerInfo.phone}

WHAT'S NEXT?
Your order will be handcrafted in our Johannesburg workshop within 3-5 business days. We'll send tracking information once it ships.

Charna Leather Goods
Johannesburg, South Africa
hello@charna.co.za | +27 12 345 6789
    `;
  }
}