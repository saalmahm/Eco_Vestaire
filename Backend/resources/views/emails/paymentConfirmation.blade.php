<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #e0e0e0;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #333333;
        }
        .content {
            padding: 20px 0;
        }
        .content p {
            margin: 0 0 15px;
            color: #555555;
        }
        .order-details {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #1a73e8;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin: 15px 0;
        }
        .button:hover {
            background-color: #0d5bcd;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            font-size: 14px;
            color: #777777;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Payment Received</h1>
        </div>
        <div class="content">
            <p>Hello {{ $buyer->first_name }},</p>
            <p>Thank you for your purchase! We've received your payment for:</p>
            
            <div class="order-details">
                <p><strong>Order #{{ $order->id }}</strong></p>
                <p><strong>Item:</strong> {{ $item->title }}</p>
                <p><strong>Amount Paid:</strong> {{ $order->amount_paid }} USD</p>
                <p><strong>Payment Date:</strong> {{ $order->paid_at }}</p>
            </div>

            <p>Your order is now being processed by the seller.</p>
            

            <p>You'll receive shipping information within 1-2 business days.</p>
            
            <p>If you have any questions, please reply to this email.</p>
            <p>Best regards,<br>The {{ config('app.name') }} Team</p>
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>