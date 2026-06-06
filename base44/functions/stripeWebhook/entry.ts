import Stripe from 'npm:stripe@14.21.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response('Webhook Error', { status: 400 });
  }

  const base44 = createClientFromRequest(req);

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userEmail = session.metadata?.user_email || session.customer_email;

      if (userEmail) {
        const credits = await base44.asServiceRole.entities.UserCredits.filter({ user_email: userEmail });

        if (credits.length > 0) {
          await base44.asServiceRole.entities.UserCredits.update(credits[0].id, { tier: 'dreamer' });
          console.log(`Upgraded user ${userEmail} to dreamer tier`);
        }
      }
    }

    if (event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.updated') {
      const subscription = event.data.object;
      // Find user by customer ID - fetch sessions to find email
      const sessions = await stripe.checkout.sessions.list({ customer: subscription.customer, limit: 1 });
      const userEmail = sessions.data[0]?.customer_email || sessions.data[0]?.metadata?.user_email;

      if (userEmail) {
        const credits = await base44.asServiceRole.entities.UserCredits.filter({ user_email: userEmail });
        if (credits.length > 0) {
          await base44.asServiceRole.entities.UserCredits.update(credits[0].id, {
            tier: 'free',
          });
          console.log(`Downgraded user ${userEmail} back to free tier`);
        }
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err.message);
  }

  return Response.json({ received: true });
});