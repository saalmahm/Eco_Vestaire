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
        .status {
            font-weight: bold;
            color: #1a73e8;
        }
        .status-active {
            color: #34a853;
        }
        .status-suspended {
            color: #ea4335;
        }
        .status-pending {
            color: #fbbc05;
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
        .footer a {
            color: #1a73e8;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        .reason-box {
            background-color: #f8f9fa;
            padding: 15px;
            border-left: 4px solid #ea4335;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>
                @if($status === 'active')
                    Account Approved!
                @elseif($status === 'suspended')
                    Account Suspended
                @else
                    Account Status Update
                @endif
            </h1>
        </div>
        <div class="content">
            <p>Hello {{ $user->first_name }},</p>

            @if($status === 'active')
                <p>We're pleased to inform you that your account has been <span class="status status-active">approved</span> and is now fully active.</p>
                <p>You can now access all features of our platform.</p>
            @elseif($status === 'suspended')
                <p>Your account has been <span class="status status-suspended">suspended</span>.</p>
                <p>If you believe this is a mistake, please contact our support team.</p>
            @else
                <p>Your account status has been updated to: <span class="status status-pending">{{ $status }}</span></p>
                <p>We'll notify you when there are further updates to your account status.</p>
            @endif

            <p>Best regards,<br>The {{ config('app.name') }} Team</p>
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
            <p>
                <a href="{{ config('app.url') }}">Visit our website</a> | 
                <a href="{{ config('app.url') }}">Contact Support</a>
            </p>
        </div>
    </div>
</body>
</html>