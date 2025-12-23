import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia', // Use the latest version or '2024-12-18.acacia' depending on what your dashboard says
  typescript: true,
});