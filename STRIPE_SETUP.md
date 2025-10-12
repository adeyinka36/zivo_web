# Stripe Setup Guide for Zivo Web

## Environment Variables

Create a `.env.local` file in the `zivo_web` directory:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51RcORgQNQzgpRy5D5AV81esv2BFmR8iHf6ZlOWYboI0QKojynk9k4orPv6o9HePTYUblRw33GpIiHCsSCTxdmi8R00pgai0vOe
NEXT_PUBLIC_API_URL=http://localhost:80/api
```

## Stripe Key Configuration

The app is already configured with a working Stripe test key that matches the mobile app. If you need to use a different key:

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers > API keys**
3. Copy your **Publishable key** (starts with `pk_test_` for testing)
4. Update the key in your `.env.local` file or in the StripeProvider component

## Security Features

### Frontend Security
- Only publishable key is used in the frontend
- All sensitive operations go through the backend
- Stripe Elements handle card data securely
- No card data is stored locally

### Backend Integration
- Payment intents are created on the backend
- Webhook signature verification
- Proper error handling and logging
- Database transaction safety

## Payment Flow

1. User fills out create form
2. Clicks "Pay & Upload"
3. Backend creates payment intent
4. User enters card details in secure modal
5. Payment is processed through Stripe
6. On success, media is uploaded
7. User is redirected to explore page

## Testing

### Test Cards
Use these test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Insufficient Funds**: `4000 0000 0000 9995`

### Test Details
- Use any future expiry date
- Use any 3-digit CVC
- Use any postal code

## Error Handling

The app includes comprehensive error handling:
- Network errors
- Payment failures
- Invalid payment methods
- Timeout handling
- User-friendly error messages

## Production Setup

For production:
1. Replace test keys with live keys
2. Update API URL to production endpoint
3. Ensure webhook endpoints are configured
4. Test with real payment methods

## Troubleshooting

If you encounter issues:

1. **Check environment variables**: Ensure keys are correctly set
2. **Check backend**: Verify Stripe configuration in Laravel backend
3. **Check console**: Look for error messages in browser console
4. **Check network**: Verify API calls are reaching the backend

## Security Notes

- Never use secret keys in the frontend
- Always use HTTPS in production
- Implement proper CORS policies
- Use webhook signature verification
- Log all payment attempts for monitoring
